const btn = document.getElementById('btn');
btn.addEventListener('click',async()=>{
    btn.disabled = true;
    let res = await fetch('/login',{
        method:'POST',
        headers:{
                "Content-Type": 
                "application/json"
        },
        body:JSON.stringify({
            id:document.getElementById('id').value,
            password:document.getElementById('password').value,
            chatId:window.location.hash.substring(1)
        })
});
res = await res.text();
if(res=="1"){
    window.close();
}
else{
    alert("Incorrect Login!")
    btn.disabled = false;
}
 
});