const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB= require('./config/db')
const userRoute = require('./routes/users.js')

dotenv.config({path: 'config/config.env' })

connectDB()

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.urlencoded({extended: false}))
app.use(express.json());

app.set("view engine", "pug")

app.use('/', userRoute)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})