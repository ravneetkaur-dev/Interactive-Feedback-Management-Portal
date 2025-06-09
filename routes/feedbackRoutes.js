const express=require('express');
const router=express.Router();
const feedbackController=require('../controller/feedbackController');

router.get('/',feedbackController.getFeedback);
router.post('/',feedbackController.postfeedback);
router.post('/likes/:id',feedbackController.postlikes);
router.post('/dislikes/:id',feedbackController.postdislikes);
module.exports=router;
