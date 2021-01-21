const { urlencoded } = require('express');
const fetch = require('node-fetch');
const months = require('./constants');
const { getUser } = require('./db');



async function _fetch({type,id,password}){
    let res = await fetch(`https://newlnct.herokuapp.com/${type}?username=${id}&password=${password}&token`);
        res = await res.json();
        return res;
}
function validateUser({chatId}){
    let user = getUser({chatId});
    if(!user) throw "Please Log in First!";
    const id = user['id'];
    let password = user['password'];
    return ({id,password});
}
module.exports.login  =async function login({id,password}){
    password = encodeURIComponent(password);
    
    try{
        return await _fetch({type:'login',id,password});
    }
    catch(err){
       return "error"; 
    }
}


module.exports.getAttendance = async function getAttendance({chatId}){
    try{
        let {id,password} = validateUser({chatId});
        password = encodeURIComponent(password);
        let res = await _fetch({type:'',id,password});
        return `
        Your Attendance is ${res['Percentage']} % \r\nTotal  ${res['Total Lectures']} Lectures  \r\nYou were present in ${res['Present ']} Lectures
        `;
    }
    catch(err){
       return err; 
    }

}
module.exports.getAttendanceByDate = async({date,chatId})=>{
    try{
        let {id,password} = validateUser({chatId});
        date = date.split('/');
        if(date.length!=3) throw "Incorrect date formate";
        let day = date[0];
        let month = date[1];
        let year = date[2];
        if((day.length>2) || month.length>2 || year.length!=4) throw "Incorrect date format"
        day==2?day:"0"+day;
        month = months[parseInt(month)-1];
        password = encodeURIComponent(password);
        let res =  await _fetch({type:'dateWise',id,password});
        for(let _ of res[0]){
            if(_['date']==`${day} ${month} ${year}`){
                let data =  _['data'];
                let result = '';
                for(let a of data){
                    let subject = Object.keys(a)[0];
                    let status = a[subject];
                    result+=`${subject} :- ${status}\r\n`;
                }
                return result;
            }
        }
        return 'Date not found!';
    }
    catch(err){
       return err; 
    }
}