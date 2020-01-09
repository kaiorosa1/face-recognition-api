const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs')
const app = express();
const cors = require('cors');


app.use(express.json());
app.use(cors());


const database ={
  users:  [
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
}

app.get('/',(req,res)=>{
    res.send(database.users);
});

app.get('/profile/:id',(req, res)=>{
    const {id} = req.params;

    database.users.forEach(user =>{
        if(user.id === id){
            return res.json(user);
        }
    });
    res.status('404').json('user not found');
});

app.post('/signin',(req,res)=>{
    let isSuccess = false;
    if(req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password){
            isSuccess = true;
        res.json('success');
    }
    if(!isSuccess){
        res.status('404').json('fail');
    }
});

app.post('/register',(req,res)=>{
    const {email, password, name} = req.body;
    database.users.push( {
        "id": "134",
        "email": email,
        "password": password,
        "name": name,
        "entries": 0,
        "joined": new Date()
    });
    res.json(database.users[database.users.length-1]);
});

app.post('/image',(req,res)=>{
    const {id} = req.params;

    database.users.forEach(user =>{
        if(user.id === id){
            user.entries++;
            return res.json(user.entries);
        }
    });
    res.status('404').json('not found');
});

app.listen(3001,()=>{
    console.log("Server being listened on port 3001");
});

/* 

/ -> this is working
/signin -> POST success/fail
/register -> POST user
/profile/:idUser -> GET user
/image -> PUT  -> user

*/