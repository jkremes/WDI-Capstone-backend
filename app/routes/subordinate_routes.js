// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for subordinates
const Subordinate = require('../models/subordinate')

// we'll use this to intercept any errors that get thrown and send them
// back to the client with the appropriate status code
const handle = require('../../lib/error_handler')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /subordinates
router.get('/subordinates', requireToken, (req, res) => {
  // console.log(res.body)
  Subordinate.find()
    // .then(console.log(subordinates))
    .then(subordinates => {
      // `subordinates` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return subordinates.map(subordinate => subordinate.toObject())
    })
    // respond with status 200 and JSON of the subordinates
    .then(subordinates => res.status(200).json({ subordinates: subordinates }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// SHOW
// GET /subordinates/5a7db6c74d55bc51bdf39793
router.get('/subordinates/:id', requireToken, (req, res) => {
  // req.params.id will be set based on the `:id` in the route
  Subordinate.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "subordinate" JSON
    .then(subordinate => res.status(200).json({ subordinate: subordinate.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// CREATE
// POST /subordinates
router.post('/subordinates', requireToken, (req, res) => {
  // console.log(req.body.first_name)
  // console.log(req.body)
  // console.log(req.user.id)
  // console.log(req.body.subordinate)
  // console.log(req.user)
  // set owner of new subordinate to be current user

  // let subordinate = {
  //   first_name: req.body.first_name,
  //   last_name: req.body.last_name,
  //   address: req.body.address,
  //   owner: req.user
  // }

  // let subordinate = subordinateParams.toObject()

  // console.log(subordinate)

  req.body.owner = req.user.id
  // console.log(req.body)
  // console.log('this is what you are sending to your Mongoose Schema: ' + req.body)
  // req.body.first_name = req.body.subordinate.first_name
  // console.log(req.body.subordinate.first_name)
  // req.body.subordinate.owner = req.user.id

  Subordinate.create(req.body)
    // console.log(subordinate)
    // respond to succesful `create` with status 201 and JSON of new "subordinate"
    .then(subordinate => {
      // console.log(subordinate)
      res.status(201).json({ subordinate: subordinate.toObject() })
    })
    // console.log(subordinate)
    // .then(console.log(subordinate))
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(err => handle(err, res))
})

// UPDATE
// PATCH /subordinates/5a7db6c74d55bc51bdf39793
router.patch('/subordinates/:id', requireToken, (req, res) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.subordinate.owner

  Subordinate.findById(req.params.id)
    .then(handle404)
    .then(subordinate => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, subordinate)

      // the client will often send empty strings for parameters that it does
      // not want to update. We delete any key/value pair where the value is
      // an empty string before updating
      Object.keys(req.body.subordinate).forEach(key => {
        if (req.body.subordinate[key] === '') {
          delete req.body.subordinate[key]
        }
      })

      // pass the result of Mongoose's `.update` to the next `.then`
      return subordinate.update(req.body.subordinate)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// DESTROY
// DELETE /subordinates/5a7db6c74d55bc51bdf39793
router.delete('/subordinates/:id', requireToken, (req, res) => {
  Subordinate.findById(req.params.id)
    .then(handle404)
    .then(subordinate => {
      // throw an error if current user doesn't own `subordinate`
      requireOwnership(req, subordinate)
      // delete the subordinate ONLY IF the above didn't throw
      subordinate.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

module.exports = router
