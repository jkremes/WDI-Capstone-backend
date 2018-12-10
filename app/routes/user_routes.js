const express = require('express')
// jsonwebtoken docs: https://github.com/auth0/node-jsonwebtoken
const crypto = require('crypto')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')
// bcrypt docs: https://github.com/kelektiv/node.bcrypt.js
const bcrypt = require('bcrypt')

// see above for explanation of "salting", 10 rounds is recommended
const bcryptSaltRounds = 10

const handle = require('../../lib/error_handler')
const BadParamsError = require('../../lib/custom_errors').BadParamsError

const User = require('../models/user')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// SIGN UP
// POST /sign-up
router.post('/sign-up', (req, res) => {
  // console.log('this is the req.body.name ' + req.body.name)
  // console.log('This is the req ' + req)
  // console.log('This is req.body ' + req.body)
  // let obj = JSON.parse(req)
  // console.log(obj)
  // start a promise chain, so that any errors will pass to `handle`
  Promise.resolve(req.body)
  // console.log(credentials)
  // console.log(req.body.credentials)
    // reject any requests where `credentials.password` is not present, or where
    // the password is an empty string
    .then(body => {
      // console.log(body)
      if (!body.password ||
          body.password !== body.password_confirmation) {
        throw new BadParamsError()
      }
    })
    // generate a hash from the provided password, returning a promise
    // let hash = bcrypt.hash(req.body.password, bcryptSaltRounds)
    // console.log(hash)
    .then(() => bcrypt.hash(req.body.password, bcryptSaltRounds))
    // bcrypt.hash(req.body.password, bcryptSaltRounds, function(err, hash) {
    //   return {
    //     name: req.body.name,
    //     email: req.body.email,
    //     hashedPassword: hash
    //   }
    // })
    .then(hash => {
      // return necessary params to create a user
      return {
        name: req.body.name,
        email: req.body.email,
        hashedPassword: hash
      }
    })
    // create user with provided email and hashed password
    .then(user => User.create(user))
    // send the new user object back with status 201, but `hashedPassword`
    // won't be send because of the `transform` in the User model
    .then(user => res.status(201).json({ user: user.toObject() }))
    // pass any errors along to the error handler
    .catch(err => handle(err, res))
})

// SIGN IN
// POST /sign-in
router.post('/sign-in', (req, res) => {
  const pw = req.body.password
  let user

  // find a user based on the email that was passed
  User.findOne({ email: req.body.email })
    .then(record => {
      // if we didn't find a user with that email, send 422
      if (!record) {
        throw new BadParamsError()
      }
      // save the found user outside the promise chain
      user = record
      // `bcrypt.compare` will return true if the result of hashing `pw`
      // is exactly equal to the hashed password stored in the DB
      return bcrypt.compare(pw, user.hashedPassword)
    })
    .then(correctPassword => {
      // if the passwords matched
      if (correctPassword) {
        // the token will be a 16 byte random hex string
        const token = crypto.randomBytes(16).toString('hex')
        user.token = token
        // save the token to the DB as a property on user
        return user.save()
      } else {
        // throw an error to trigger the error handler and end the promise chain
        // this will send back 422 and a message about sending wrong parameters
        throw new BadParamsError()
      }
    })
    .then(user => {
      // return status 201, the email, and the new token
      res.status(201).json({ user: user.toObject() })
    })
    .catch(err => handle(err, res))
})

// CHANGE password
// PATCH /change-password
router.patch('/change-password', requireToken, (req, res) => {
  let user
  // `req.user` will be determined by decoding the token payload
  User.findById(req.user.id)
    // save user outside the promise chain
    .then(record => { user = record })
    // check that the old password is correct
    .then(() => bcrypt.compare(req.body.old_password, user.hashedPassword))
    // `correctPassword` will be true if hashing the old password ends up the
    // same as `user.hashedPassword`
    .then(correctPassword => {
      // throw an error if the new password is missing, an empty string,
      // or the old password was wrong
      if (!req.body.new_password || !correctPassword) {
        throw new BadParamsError()
      }
    })
    // hash the new password
    .then(() => bcrypt.hash(req.body.new_password, bcryptSaltRounds))
    .then(hash => {
      // set and save the new hashed password in the DB
      user.hashedPassword = hash
      return user.save()
    })
    // respond with no content and status 200
    .then(() => res.sendStatus(204))
    // pass any errors along to the error handler
    .catch(err => handle(err, res))
})

router.delete('/sign-out', requireToken, (req, res) => {
  // create a new random token for the user, invalidating the current one
  req.user.token = crypto.randomBytes(16)
  // save the token and respond with 204
  req.user.save()
    .then(() => res.sendStatus(204))
    .catch(err => handle(err, res))
})

module.exports = router
