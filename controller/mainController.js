const express=require('express');
const app=express();
exports.getHome=(req,res)=>{
    res.render('homepage');
}