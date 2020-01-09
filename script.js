const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const database = [
    {
        "id": "123",
        "email": "john@gmail.com",
        "password": "cool",
        "name": "John",
        "entries": 0,
        "joined": new Date()
    },
    {
        "id": "124",
        "email": "brenda@gmail.com",
        "password": "bunnies",
        "name": "Brenda",
        "entries": 0,
        "joined": new Date()
    }
]
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send("Getting the root...");
});

app.get('/profile/:id',(req, res)=>{
    const {id} = req.params;

    database.forEach(user =>{
        if(user.id === id){
            return res.json(user);
        }
    });
    res.status('404').json('user not found');
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
        "id": "134",
        "email": email,
        "password": password,
        "name": name,
        "entries": 0,
        "joined": new Date()
    });
    res.json(database[database.length-1]);
});

app.post('/image',(req,res)=>{
    const {id} = req.params;

    database.forEach(user =>{
        if(user.id === id){
            user.entries++;
            return res.json(user.entries);
        }
    });
    res.status('404').json('not found');
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