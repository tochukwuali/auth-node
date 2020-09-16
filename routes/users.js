const express = require('express')
const Router = express.Router()
const User = require('../models/users')

Router
    .route('/')
    .get((req, res) => {
        res.render("index")
    })
Router
    .route('/register')
    .get((req, res) => {
        res.render("register")
    })
    .post(async (req, res) => {
        try {
            await User.create(req.body)
            res.redirect("dashboard")
        } catch (error) {
            console.log(error)
            res.send('error/500')
        }
    })

Router
    .route('/login')
    .get((req, res) => {
        res.render("login")
    })
    .post(async (req, res) => {
        try {
            await User.findOne({ email: req.body.email }).then((user) => {
                 // Check if user exists
                if (!user) {
                return res.status(404).json({ emailnotfound: "Email not found" });
                }  

                if (req.body.password !== user.password) {
                    return res.render("login", {
                        error: "Incorrect email/Password"
                    }) 
                } else {
                    res.redirect("dashboard")
                }
            })
        } catch (error) {
            
        }
    })

Router
    .route('/dashboard')
    .get((req, res) => {
        res.render("dashboard")
    })

module.exports = Router; 