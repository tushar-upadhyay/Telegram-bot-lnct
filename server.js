require('dotenv').config();
const express  =  require('express');
const app = express();

const path =  require('path');
const {bot} = require('./bot');
const {login,getAttendance} = require('./login');
const {setUser, getUser, deleteUser} = require('./db');
app.use(express.json());
app.use(express.static('./public'));
app.get('/login',(req,res)=>{
  res.sendFile(path.join(__dirname,'/public/login.html'));
});
app.post('/login',async(req,res)=>{
  const {id,password,chatId} = req.body;
  const result  = await login({id,password});
  if(result!="error"){
    bot.telegram.sendMessage(chatId,`Logged In Successfully as ${result['Name']}`);
    setUser({chatId,id,password});
    return res.send("1");
  }
    bot.telegram.sendMessage(chatId,'Login Failed');
    res.send("0");
});


app.listen(process.env.PORT||3000,()=>console.log('Listening....'));