const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express()
app.use(express.json())
const port = 8000

// in-memory database
let users = [];

const ACCESS_SECRET = 'ekjfhwdufgewurfgejwrf'
const REFRESH_SECRET = 'EJDFGWYUFGDWJHFGEQWEJ'


// 1. Register a user (Hashing the password).
app.post('/users', async(req,res) => {
    const { email, password} = req.body;

    const hashed = await bcrypt.hash(password, 10) // salt prevents the "rainbow table attack"

    const user = {
        email, 
        password: hashed
    }

    console.log(user.password)
    users.push(user)

    res.status(201).json({message: 'user created successfully'})
})

// 2. Login
app.post('/users/login', async(req, res) => {
    const { email, password } = req.body
    const user = users.find((u) => u.email === email)
    if(!user) {
        return res.status(401).json({message: 'Invalid Credentials'})
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password)

    if(!isCorrectPassword) {
        return res.status(401).json({message: 'Invalid Credentials'})
    }

    const accessToken = createAccessToken(user)
    const refreshtoken = createRefreshToken(user)

    return res.status(200).json({accessToken, refreshtoken})
})

// 3. View My Data
app.get('/me', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]
    if(!token) {
        return res.status(401).json({message: "Unauthorized!"})
    }

    try {
        const user = jwt.verify(token, ACCESS_SECRET)
        res.json({user})
    } catch(error) {
        return res.status(401).json({message: "Unauthorized!"})
    }
})


// 4. Use Refresh Token to get new Access Tolen
app.post('/refresh', (req, res) => {
    const token = req.body.token
    if(!token) {
        return res.status(401).json({message: "Unauthorized!"})
    }

    try {
        const user = jwt.verify(token, REFRESH_SECRET)
        const newAccessToken = createAccessToken(user)
        res.json({newAccessToken})
    } catch(error) {
        return res.status(401).json({message: "Unauthorized!"})
    }
})

function createAccessToken(user) {
    return jwt.sign({email: user.email}, ACCESS_SECRET, {expiresIn: '1h'})
}

function createRefreshToken(user) {
    return jwt.sign({email: user.email}, REFRESH_SECRET, {expiresIn: '12h'})
}



app.listen(port, () => {
    console.log(`Server started on port ${port}.`)
})