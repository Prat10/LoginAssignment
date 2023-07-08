const express=require('express');
const app=express();
require('./db/conn')
app.use(express.json());
app.use(require('./routers/auth'));

app.get('/',(req,res)=>{
    res.send('Hello server');
})

app.listen(3001,()=>{
    console.log('server is running');
})