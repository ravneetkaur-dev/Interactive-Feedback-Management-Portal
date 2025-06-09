const mongoose= require('mongoose');
const connectDb=async()=>{
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/feedback');
        console.log("Successfully connected to Mongodb!!");
    }
    catch(err){
        console.log("Error while connecting to the database!!");
    }
}
module.exports=connectDb;