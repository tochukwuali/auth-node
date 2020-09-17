const express = require('express')
const Router = express.Router()
const User = require('../models/users')
const bcrypt = require('bcryptjs')

const sessionizeUser = user => {
  return { userId: user.id, firstname: user.firstname };
}

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
            let { firstname, lastname, email, password } = req.body

            let hash = bcrypt.hashSync(password, 14)
            password = hash

            const newUser = new User({ firstname, lastname, email, password });
            const sessionUser = sessionizeUser(newUser);
            await newUser.save()

            req.session.user = sessionUser;
            console.log(req.session);
            //res.send(sessionUser);
            res.redirect("/dashboard")
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

                if (!bcrypt.compareSync(req.body.password, user.password)) {
                    return res.render("login", {
                        error: "Incorrect Password"
                    }) 
                }   
                const sessionUser = sessionizeUser(user);
                req.session.user = sessionUser;
                console.log(req.session);
                res.redirect("/dashboard")
            })
        } catch (error) {
            
        }
    })

Router
    .route('/dashboard')
    .get(async (req, res, next) => {
        try {
            if (!(req.session && req.session.user)) {
            console.log(req.session.user)
            return res.redirect("/login")
        } 

       await User.findById({_id: req.session.user.userId}).then((user) => {
            if (!user) {
              return res.redirect("/login");
            }
            console.log(req.session.user);
            res.render("dashboard");
        })
        } catch (error) {
            console.log(error)
        }
        
    })

    Router
        .route('/logout')
        .delete(async ({session}, res, next) => {
            try {
              const user = session.user;
              if (user) {
                session.destroy(err => {
                  if (err) throw err;
                  res.clearCookie(process.env.SESS_NAME);
                  console.log(session)
                  res.redirect("/login");
                });
              } else {
                throw new Error("Something went wrong");
              }
            } catch (err) {
              res.status(422).send(parseError(err));
            }
        })

module.exports = Router; 