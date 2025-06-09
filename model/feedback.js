const mongoose=require('mongoose');
const feedbackSchema= new mongoose.Schema({
    comment:{type:String, required: true},
    createdAt:{type: Date, default: Date.now},
    lessonContent: { type: Number, min: 1, max: 10, required: false },
    teacherExplanation: { type: Number, min: 1, max: 10, required: false },
    classEngagement: { type: Number, min: 1, max: 10, required: false },
    pacing: { type: Number, min: 1, max: 10, required: false },
    materials: { type: Number, min: 1, max: 10, required: false },
    environment: { type: Number, min: 1, max: 10, required: false },
    homework: { type: Number, min: 1, max: 10, required: false },
    assessment: { type: Number, min: 1, max: 10, required: false },
    generalExperience: { type: Number, min: 1, max: 10, required: false },
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0}
});
module.exports=mongoose.model('Feedback',feedbackSchema);