const express=require('express');
 function adminOnly(req,res,next){
    if(req.session.isAdmin){
        next();
    }else{
        res.redirect('/admin/login');
    }
 }
 module.exports=adminOnly;