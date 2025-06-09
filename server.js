const express=require('express');
const session= require('express-session');
const connectDB=require('./config/db');
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(session({
    secret: '#ItIsSecret007!#',
    resave: false,
    saveUninitialized: false,
    cookie:{secure:false}
}))

const path=require('path');
const adminRoutes=require('./routes/adminRoutes.js');
const feedbackRoutes=require('./routes/feedbackRoutes.js');
const homeRoutes=require('./routes/homeRoutes');
app.use(express.json());
app.set('views',path.join(__dirname,'views'));
app.use(express.static('public'));
app.set('view engine','ejs');
connectDB();
app.use('/',homeRoutes);
app.use('/admin',adminRoutes);
app.use('/feedback',feedbackRoutes);
const PORT=5665;
app.listen(PORT,(err)=>{
    if(err){
        console.log("Error while listening to the port!!");
    }else{
        console.log("Server listening on the port: ",PORT);
    }
})

