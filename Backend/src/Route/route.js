const express = require('express');
const router = express.Router();
const adminCollection = require('../Database/adminDb');
const userCollection = require('../Database/userDb');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

cloudinary.config({
    cloud_name: "dksmzs6tm",
    api_key: "122596395178412",
    api_secret: "W_lWL_V0IROP4-lNb99MR-r9NUM"
});

router.post('/save/user-data', async(req, res) => {
    try{
        const existingData = await userCollection.find();
        let idNumber = 10000 + existingData.length;
        const newUser = new userCollection({
            id: idNumber,
            name: req.body.name,
            email : req.body.email,
            testInvitationCode : req.body.testInvitationCode,
            testTime : new Date(),
            images : [],
            testDetails : {
                duration : 90,
                imageInterval : 3
            }
        })

        const result = await newUser.save()

        res.json({
            success: true,
            message:'User Data Saved Successfully',
            data: {
                ...result._doc
            }
        })
    }
    catch(err){
        res.json({
            success:false,
            message:"Some Error Occured",
            data: null
        })
    }
})

router.put('/add/images/in/user-data', async(req, res) => {
    try{
        let id = req.body.id;
        let url = req.body.url;

        const result = await userCollection.findOne({id : id});

        if(result){
            let userData = result;

            userData.images.push({
                timeStamp : new Date(),
                url : url
            });

            const updatedUserData = await userCollection.findOneAndUpdate({_id : result._id}, userData);

            res.json({
                success: true,
                message:'Image Added in the User Data',
                data: updatedUserData
            })
        }
        else{
            res.json({
                success: false,
                message: "No User Found",
                data: null
            })
        }
    }
    catch(err){
        res.json({
            success: false,
            message:'Some Error Occured',
            data: null
        })
    }
})


router.post('/admin/login', async(req, res) => {
    try{
        let email = req.body.email;
        let password = req.body.password;

        const admin = await adminCollection.findOne({email : email});

        if(admin){
            if(admin.password === password){
                res.json({
                    success: true,
                    message:'Admin Logged In Successfully',
                    data: admin
                })
            }
            else{
                res.json({
                    success: false,
                    message: "Invalid Email or Password",
                    data: null
                })
            }
        }
        else{
            res.json({
                success: false,
                message: "Invalid Email or Password",
                data: null
            })
        }
    }
    catch(err){
        res.json({
            success:false,
            message:"Some Error Occured",
            data: null
        })
    }
})

router.get('/get/user-data/for/admin/id/:id', async(req, res) => {
    try{
        let id = parseInt(req.params.id);
        const admin = await adminCollection.find({id : id});
        
        if(admin){
            const userData = await userCollection.find();

            res.json({
                success: true,
                message:'User Data Found.',
                data: userData
            })
        }
        else{
            res.json({
                success: false,
                message: "Invalid Admin",
                data: null
            })
        }
    }
    catch(err){
        res.json({
            success:false,
            message:"Some Error Occured",
            data: null
        })
    }
})


router.post('/save/file', upload.single('file'), async(req, res) => {
    const file = req.body.file;

    cloudinary.uploader.upload(file)
    .then((data) => {
        res.json({
            success: true,
            message:'File Uploaded Successfully.',
            data: data.secure_url
        })
    })
    .catch((err) => {
        res.json({
            success:false,
            message:"Some Error Occured",
            data: null
        })
    });
})

router.get('/get/user-data/by/id/:id', async(req, res) => {
    try{
        let id = parseInt(req.params.id);
        const user = await userCollection.findOne({id : id});
        
        if(user){
            res.json({
                success: true,
                message:'User Data Found.',
                data: user
            })
        }
        else{
            res.json({
                success: false,
                message: "Invalid User",
                data: null
            })
        }
    }
    catch(err){
        res.json({
            success:false,
            message:"Some Error Occured",
            data: null
        })
    }
})


module.exports=router;