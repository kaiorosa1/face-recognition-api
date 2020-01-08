const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const database = [
    {
        "email": "john@gmail.com",
        "password": "cool",
        "name": "John",
        "entries": 0
    },
    {
        "email": "brenda@gmail.com",
        "password": "bunnies",
        "name": "Brenda",
        "entries": 0
    }
]
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send("Getting the root...");
});

app.post('/signin',(req,res)=>{
    if(req.body.email === database[0].email &&
        req.body.password === database[0].password){
        res.json('success');
    }
    res.status('404').json('fail');
});

app.post('/register',(req,res)=>{
    const {email, password, name} = req.body;
    database.push( {
        "email": email,
        "password": password,
        "name": name,
        "entries": 0
    });
    res.json(database[database.length-1]);
});

app.listen(3000,()=>{
    console.log("Server being listened on port 3000");
});

/* 

/ -> this is working
/signin -> POST success/fail
/register -> POST user
/profile/:idUser -> GET user
/image -> PUT  -> user

*/