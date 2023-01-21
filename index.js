const express = require('express')
const app = express()
const session = require('express-session')
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

const store = new session.MemoryStore();

app.use(session({
  secret: "Shh, its a secret!",
  saveUninitialized: false,
  resave: false,
  store: store
}));

var token = "b2f1c5d7e8f9a0b1c2d3e4f5a6b7c8d9"

app.post(`/login`, async (req, res) => {
  let reqToken = req.headers['authorization'];
  reqToken = reqToken.split(' ')[1]
  console.log("reqToken", reqToken)

  if (reqToken != token) {
    res.status(401).send("token mismatched")
  }
  else {
    console.log("this is me ")
    req.session.user = req.body
    req.session.save()
    res.status(200).send("session saved")
  }
})


app.get('/getrole', async (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user })
  }
  else {
    res.send({ loggedIn: false })
  }
})

// APII to destroy sessions 
app.get('/destroy-session', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err)
      console.log("user - sessions fail", req.session.user)
      res.send({ sessionDestroyed: false })
    }

    console.log("user - sessions success")
    return res.send({ sessionDestroyed: true })
    // return res.redirect("/auth/login")
  })
})

app.listen(8080, () => {
  console.log("server is listing on port : 8080")
})