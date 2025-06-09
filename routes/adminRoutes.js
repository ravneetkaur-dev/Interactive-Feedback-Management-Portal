const express=require('express');
const router=express.Router();
const adminController=require('../controller/adminController');
const adminOnly=require('../middleware/authentication');

router.get('/login',adminController.getAdmin);
router.post('/login',adminController.login);
router.get('/dashboard',adminOnly,adminController.getDashboard);
router.post('/dashboard/customData',adminController.customData);
// router.post('/admin/delete/:id');
module.exports=router;