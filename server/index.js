// Libraries and dependencies
require('dotenv').config()
const express = require('express')
const session = require('express-session')
const massive = require('massive')

//local file imports
const authCtrl = require('./controllers/authController')

const {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env

const app = express()

app.use(express.json())

massive(CONNECTION_STRING).then((db) => {
    app.set("db", db)
    console.log(`DATABASE: connected`)
})

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365
    }
}))

app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
// app.post('/auth/logout', authCtrl.logout)

app.listen(SERVER_PORT, () => {
    console.log(`PORT: ${SERVER_PORT}`)
})