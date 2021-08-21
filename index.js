const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const storageRoute = require('./routes/storage')

const run = async () => {
  dotenv.config()
  mongConnect = () =>
    new Promise((resolve, reject) => {
      try {
        mongoose.connect(
          process.env.MONGO_URL,
          { useNewUrlParser: true, useUnifiedTopology: true },
          (err) => {
            console.log('Error: ' + err)
            if (!err) resolve()
          }
        )
      } catch (err) {
        reject(err)
      }
    })

  try {
    await mongConnect()
    console.log('DB connection established')
  } catch (err) {
    console.log('DB connection failed')
  }
  //middleware
  app.use(express.json())
  app.use(helmet())
  app.use(morgan('common'))

  app.use('/api/posts', postRoute)
  app.use('/api/users', userRoute)
  app.use('/api/auth', authRoute)
  app.use('/api/storage', storageRoute)

  app.get('/', (req, res) => {
    res.send('welcome to homepage')
  })

  app.get('/users', (req, res) => {
    res.send('welcome to user homepage')
  })

  app.listen(8800, () => {
    console.log('Backend serever is running!fafafads')
  })
}

run()
