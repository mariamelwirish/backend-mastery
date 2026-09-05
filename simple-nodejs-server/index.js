/* IMPORTS*/
// import express library
const express = require('express');

// returns an app object
const app = express();

// host on port 3000
const port = 3000;

// LOGIC
// Letting the app understand JSON in its requests and responses.
app.use(express.json())

// ENDPOINTS
// GET method:
//  1. '/hello-world' is the path
//  2. Function as parameter (req, res) => {}:
//      - in express, you have access to 2 objects:
//          a. req: request.
//          b. res: response.
//  
app.get('/hello-world', (req, res) => {
    console.log('Hello World');
    res.status(200).json({message: 'Hello World!'});
})

app.post('/hello-world', (req, res) => {
    const name = req.body.name;
    res.status(200).json({message: 'Hello ' + name + '!'});
})

// LISTEN
// Listen to port on host ()
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})

/***********/
// JSON

// Object
const human = {
    name: 'Human',
    age: 12,
    siblings: {
        name: 'brother',
        age: 15,
        siblings: {
            // .... 
        }
    }
};

// Array of Objects
const humans =
[
    {
        name: 'Human',
        age: 12,
        siblings: {
            name: 'brother',
            age: 15,
            siblings: {
                // .... 
            }
        }
    }, 
    {
        name: 'Human 2',
        age: 12,
        siblings: {
            name: 'brother',
            age: 15,
            siblings: {
                // .... 
            }
        }
    }, 
];