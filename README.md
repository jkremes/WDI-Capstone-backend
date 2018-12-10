cmDr

![cmDr Logo](src/assets/cmDr3.jpeg)

## Description

This app is meant to give commanders an efficient alternative to recalling their troops. The military has a requirement for troops to be able to be recalled at a moments notice. Currently, the process is long and arduous. This app is designed to make the process simple. With the tap of a finger a commander can edit the information for their subordinates. Please contact with any feedback and look out for more features in the future. Thank you!

Repository Front-End:

https://github.com/jkremes/WDI-Capstone-frontend

Link to Front-End:

https://jkremes.github.io/WDI-Capstone-frontend/

Repository Back-End:

https://github.com/jkremes/WDI-Capstone-backend

Link to Back-End:

https://mysterious-mesa-43439.herokuapp.com/

## Instructions

1. User should sign-up if not having an account yet.
2. User should login if they are already signed-up to use the app.
3. The app allows a signed-in user to troops which act as resources to the troop list.
4. After logging in the app will take you to an index view that will allow the user to change password, logout, or see troops.
5. The change password will open a form underneath that can be hidden once the change password button is again clicked.
6. The sign-out will bring the user back to the first page where the user can then sign-up or login.
7. The see troops button will take the user to a page which shows the data table of all the users resources(troops).
8. The search function works for any dat populated in the table.
9. If the user has no resources a message will be displayed in the table which shows "Sorry, nothing to display here :(".
10. A user can add a resource by clicking the "New Troop" button.
11. Once a user has resources they can then edit or delete with the respective buttons found within that table.
12. From the see troops the user can click the 'home' button which will bring the user back to the index page.
13. Ensure you install dependencies for app to allow the app to properly run see below for links to these technologies:

- Mongo
https://www.mongodb.com/

- Mongoose
https://mongoosejs.com/docs/index.html

- Node
https://nodejs.org/en/

- Vue
https://vuejs.org/v2/guide/installation.html

- VueSweetalert2
https://sweetalert2.github.io/#download

- Vuetify
https://vuetifyjs.com/en/getting-started/quick-start

use `npm install` in order to get these going!


## ERD

![ERD](src/assets/IMG_8461.JPG)


## WireFrame

![ERD](src/assets/wireframe.JPG)

## User Stories

Authentication:

As a user, I want to be able to sign in to view data from previous sessions
As a user, i want to be able to create an account
As a user, I want to be able to change my password
As a user, I want to be able to sign out

Troop List:

I want to store a list of subordinates
I want to be able to check each troop for accountability
I want to be able to edit or delete troops from the list (Different than checking them off)
I want to be able to sort troops

## Structure

Authentication:

| Request | Routes | Schema |
|:-------:|:-------:|:------:|
|  POST | /sign-up  | Requires=> email: String, password: String, password_confirmation: String |
|  POST |  /sign-in | Requires=> email: String, password: String |
|  PATCH |  /change-password | Requires=> old_password: String, new_password: String, token: String |
|  DELETE |  /sign-out | Requires=> token: String |

Adventures:

| Request | Routes | Schema |
|:-------:|:-------:|:------:|
|  GET | /subordinates  | Requires=> token: String |
|  GET |  /subordinates/:id | Requires=> token: String |
|  POST |  /subordinates | Requires=> priority: Number, title: String, place: String, notes: String, token: String |
|  PATCH |  /subordinates/:id | Requires=> priority: Number, title: String, place: String, notes: String, token: String |
|  DELETE | /subordinates/:id | Requires=> token: String |

## Technologies Used

- HTML

- CSS

- Mongo

- Mongoose

- JScript (edited)

- Node

- Vue

- VueRouter

- VueX

- VueSweetalert2

- Vuetify

## Planning

API:
 - Download Express API Template
 - Create a Github Repository
 - Deploy to Heroku
 - Create resource and end points
 - Test resource's end points
 - Add the relationship to a User
 - Add User ownership to resource controller

Client:
 - Research new technologies
 - Determine which best fit the app idea
 - Download front end framework (Vue CLI 3.x)
 - Create a Github Repository
 - Deploy to Github Pages
 - Test locally
 - All API calls have success or failure messages
 - Create resource
 - Get all of their owned resources
 - Delete single resource
 - Update single resource

 Final Touches:
 - README
 - Troubleshoot/Debug
 - Style

## Unsolved Issues

- Clean up user interface and add better graphics
- clean up routes, views, and components for better workflow.
- Integrate ability for commanders to utilize push notifications and determine if a subordinate has been checked as accountable or not.
- In-app chat

## App Screenshots

![Home](src/assets/home.png)

![LoggedIn](src/assets/index.png)

![SignUp](src/assets/signup.png)

![SignIn](src/assets/login.png)

![SeeTroops](src/assets/seetroops.png)

![ChangePassword](src/assets/changepassword.png)


## Created by Josh Kreimier