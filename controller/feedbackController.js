const express=require('express');
const {Feedback}=require('../model');

let message="";
let success="";
exports.getFeedback=async(req,res)=>{
    try{
        const feedbacks= await Feedback.find().sort({createdAt:-1}).limit(5);
        res.render('feedback',{feedbacks});
    }catch(err){
        message="Error while fetching the recent feedbacks!!";
        res.status(500).render('feedback',message);
    }
    
}

exports.postfeedback=async(req,res)=>{
    const feedback=new Feedback(req.body);
    await feedback.save();
    res.status(201);
    success="A quiet voice, now etched in echoes. Thank you !!";
     try{
        const feedbacks= await Feedback.find().sort({createdAt:-1});
        res.render('feedback',{feedbacks,success});
    }catch(err){
        message="Error while fetching the recent feedbacks!!";
        res.status(500).render('feedback',message);
    }
    // return res.render('feedback',{success});
}

exports.postlikes=async(req,res)=>{ 
    try{
        const feedback= await Feedback.findById(req.params.id);
        feedback.likes+=1;
        await feedback.save();
        res.json({success:true,likes:feedback.likes});
    }catch(err){
        res.status(500).json({success:false});
    }
}

exports.postdislikes=async(req,res)=>{
    try{
        const feedback=await Feedback.findById(req.params.id);
        feedback.dislikes+=1;
        await feedback.save();
        res.status(200).json({success:true,dislikes:feedback.dislikes});
    }catch(err){
        res.status(500).json({success:false});
    }
    
}

