const express = require('express')
const app = express()
const pug = require('pug')

app.set("view engine", "pug")

app.get('/', (req, res) => {
    res.render("index")
})

app.get('/register', (req, res) => {
    res.render("register")
})

app.get('/login', (req, res) => {
    res.render("login")
})

app.listen(8000, () => {
    console.log("Server is running on port 8000")
})