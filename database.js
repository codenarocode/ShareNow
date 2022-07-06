require('dotenv').config();
const mongoose=require('mongoose');

function connectDB(){
    mongoose.connect(process.env.MONGO_CONNECTION_URL,{useCreateIndex:true,useNewUrlParser:true,useUnifiedTopology:true});
    const connection= mongoose.connection;
    connection.once('open',()=>{
        console.log("Database Connected");
     }) .catch(err=>{
         console.log("Connection Failed");
     })

    
}


module.exports=connectDB;