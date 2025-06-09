const express=require('express');
const Feedback=require('../model/feedback');

const ADMIN_USERNAME='admin123@gmail.com';
const password="#iamadmin123";
let message="";
exports.getAdmin=(req,res)=>{
    res.render('adminLogin');
}

exports.login=(req,res)=>{
    const {username,pass}=req.body;
    if(username===ADMIN_USERNAME&&pass===password){
        req.session.isAdmin=true;
        res.redirect('/admin/dashboard');
    }else{
        message='Invalid Credentials!!';
        res.render('adminLogin',{message});
    }
}

exports.getDashboard=async(req,res)=>{

    const totalFeedbacks= await Feedback.countDocuments();

    const likeDislikeCount= await Feedback.aggregate([
        {
            $group: {
                _id: null,
                totalLikes: {$sum:"$likes"},
                totalDislikes: {$sum: "$dislikes"}
            }
        }
    ]);
    const totalLikes= likeDislikeCount[0]?.totalLikes||0;
    const totalDislikes= likeDislikeCount[0]?.totalDislikes||0;

    const overallAvg = await Feedback.aggregate([
        {
            $group: {
                _id: null,
                avgExperience: { $avg: "$generalExperience" }
            }
        }
    ]);

const avgExperience = overallAvg[0]?.avgExperience.toFixed(2) || "0.00";

    const [weekly,monthly]= await Promise.all([
        Feedback.aggregate([
            {$group:{_id:{$dayOfWeek:'$createdAt'},count:{$sum:1}}}
        ]),
        Feedback.aggregate([
            {$group:{_id:{$month:'$createdAt'},count:{$sum:1}}}
        ]),
        
    ]);
    const weekLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weeklyCounts = Array(7).fill(0);
    weekly.forEach(element => {
        const day = element._id % 7; 
        weeklyCounts[day] = element.count;
    });
    const weeklyData = weekLabels.map((label, i) => ({
        label,
        value: weeklyCounts[i]
    }));

    const monthLabels = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const monthlyCounts = Array(12).fill(0);
        monthly.forEach(item => {
            monthlyCounts[item._id - 1] = item.count;
        });
        const monthlyData = monthLabels.map((label, i) => ({
            label,
            value: monthlyCounts[i]
        }));
    const categories=[
        'lessonContent', 'teacherExplanation', 'classEngagement', 'pacing',
        'materials', 'environment', 'homework', 'assessment', 'generalExperience'
    ];

    const categoryAverages= {};
    for(const field of categories){
        const avg = await Feedback.aggregate([
            {$match:{[field]:{$exists: true } } },
            {
                $group: {
                    _id: null,
                    average: { $avg: `$${field}` }
                }
            }
        ]);
        categoryAverages[field]= avg.length ? parseFloat(avg[0].average.toFixed(2)) : 0;
    }

    const categoryData= categories.map(field => ({
        label: field,
        value: categoryAverages[field]
    }));

    const categoryColors = [
        '#a3472c', 
        '#c1682b', 
        '#e89b3b', 
        '#b97444', 
        '#8c4b2e', 
        '#cfa974', 
        '#7a4a3a', 
        '#9e6a45', 
        '#c78652'  
    ];


    const weekColors = [
        '#f3c892', 
        '#eab678', 
        '#d9a066', 
        '#c6905b', 
        '#a7734d', 
        '#926344', 
        '#7a4a3a'  
    ];


    const monthColors = [
        '#a3472c', 
        '#b95732', 
        '#d87c44', 
        '#e89b3b', 
        '#f1bb70', 
        '#b98463', 
        '#9a674b', 
        '#7a4a3a', 
        '#633529', 
        '#4e2c20', 
        '#b67445', 
        '#c99a6e'  
    ];


    res.render('adminDashBoard', {
        weeklyData,
        monthlyData,
        categoryData,
        totalFeedbacks,
        totalLikes,
        totalDislikes,
        avgExperience,
        weekColors,
        monthColors,
        categoryColors
    });
}

exports.customData=async(req,res)=>{
    try {
        const {startDate, endDate} = req.body;
        if (!startDate||!endDate) {
            return res.status(400).json({success: false,message: "Invalid date range." });
        }
        const start= new Date(startDate);
        const end= new Date(endDate);

        const customData = await Feedback.aggregate([
            {
                $match:{
                    createdAt:{$gte: start, $lte: end}
                }
            },
            {
                $group: {
                    _id: {$dayOfMonth: "$createdAt" },
                    count: { $sum:1 }
                }
            }
        ]);

        const result = customData.map(item => ({
            label: `Day ${item._id}`,
            value: item.count
        }));

        return res.json({ success: true, data: result });
    }catch(err){
        console.error("Custom range error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }

};

