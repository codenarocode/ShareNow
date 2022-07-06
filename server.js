const express=require('express');
const app=express();
const connectDB=require('./database');
const path=require('path')
const cors=require('cors');
const { ppid } = require('process');
app.use(express.static('public'))
app.use(express.json())
app.use(cors({
    origin:'*'
}))

connectDB();

app.set('views',path.join(__dirname,'/views'))
app.set('view engine','ejs')
const PORT=process.env.PORT ||4000;


app.use('/api/file',require('./routes/files'))
app.use('/file',require('./routes/show'))



app.listen(PORT,()=>{
    console.log("Server Started on "+PORT);
})

