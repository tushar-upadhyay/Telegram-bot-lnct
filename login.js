const { urlencoded } = require('express');
const fetch = require('node-fetch');
const { getUser } = require('./db');

module.exports.login  =async function login({id,password}){
    password = encodeURIComponent(password);
    let res = await fetch(`https://newlnct.herokuapp.com/login?username=${id}&password=${password}&token`);
    try{
        res = await res.json();
        return res;
    }
    catch(err){
       return "error"; 
    }

}


module.exports.getAttendance = async function getAttendance({chatId}){
    let user = getUser({chatId});
    if(!user) return "Please Log in First!";
    const id = user['id'];
    let password = user['password'];
    console.log(user);
    password = encodeURIComponent(password);
    let res = await fetch(`https://newlnct.herokuapp.com/?username=${id}&password=${password}`);
    try{
        res = await res.json();
        console.log(res);
        return `
        Your Attendance is ${res['Percentage']} % \r\nTotal  ${res['Total Lectures']} Lectures  \r\nYou were present in ${res['Present ']} Lectures
        `;
    }
    catch(err){
       return "error"; 
    }

} 