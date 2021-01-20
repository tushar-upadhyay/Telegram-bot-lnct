const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('db.json')
const db = low(adapter)
 
// Set some defaults
db.defaults({users:[]})
  .write()
 
module.exports.setUser =  function setUser({chatId,id,password}){
    let user = {}
    user[chatId] = {id,password}
    db.get('users').push(user).write();
}
// 
module.exports.getUser = function getUser({chatId}){
    let data = db.get('users').find(chatId).value();
    if(!data) return false;
    return ({
        id:data[chatId]['id'],
        password:data[chatId]['password']
    })
}
module.exports.deleteUser =  function deleteUser({chatId}){
   let res = db.get('users').remove(chatId).write();
   if(res.length==0) return "Please Log in first!";
   return "Logged Out Successfully!";
}


