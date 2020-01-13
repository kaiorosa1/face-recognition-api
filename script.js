const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs')
const app = express();
const cors = require('cors');
var knex = require('knex');


const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'root',
      database : 'smartbrain'
    }
  });

// db.select('*').from('users').then(data=>{console.log(data)});

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

    db.select('*').from('users').where({
        id: id
    }).then(user=>{
        if(user.length){
            res.json(user[0]);
        }else{
            res.status('404').json('user not found');
        }
    }).catch(err=>res.json('error getting the user'));
});

app.post('/signin',(req,res)=>{
   db.select('email','hash')
   .from('login')
   .where('email','=',req.body.email)
   .then(data =>{
       if(bcrypt.compareSync(req.body.password,data[0].hash)){
           return db.select('*')
           .from('users')
           .where('email','=',req.body.email)
           .then(user=>{
               res.json(user[0]);
           })
           .catch(err=>res.status(400).json('unable to get the user'));
       }else{
           res.status(400).json('WRONG CREDENTIALS')
       }
   })
   .catch(err =>{
       res.status(400).json('wrong credentials');
   })
    
});

app.post('/register',(req,res)=>{
    const {email, password, name} = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx=>{
        trx.insert({
            email: email,
            hash: hash
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0],
                name: name,       
                joined: new Date()
            }).then(users=>{
                res.json(users[0]);
            }).catch(err=>res.status(400).json('unable to join'));
        })
        .then(trx.commit)
        .catch(trx.rollback);
    });
    
    
});

app.put('/image',(req,res)=>{
    const {id} = req.body;
    db('users')
    .where('id','=',id)
    .increment('entries',1).then(entries=>{
        res.json(entries);
    }).catch(err=> res.json('unable to find entries'));
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