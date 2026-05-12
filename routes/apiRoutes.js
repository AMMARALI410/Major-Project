const express = require("express");

const router = express.Router();

const User = require("../models/User");



// GET ALL USERS
router.get("/users", async (req, res) => {

    const users = await User.find();

    res.json(users);

});



// GET SINGLE USER
router.get("/users/:id", async (req, res) => {

    const user = await User.findById(req.params.id);

    res.json(user);

});



// CREATE USER
router.post("/users", async (req, res) => {

    const newUser = new User({

        name:req.body.name,

        email:req.body.email

    });

    await newUser.save();

    res.json({

        message:"User Created",

        user:newUser

    });

});



// UPDATE USER
router.put("/users/:id", async (req, res) => {

    const updatedUser = await User.findByIdAndUpdate(

        req.params.id,

        {

            name:req.body.name,

            email:req.body.email

        },

        {

            new:true

        }

    );

    res.json(updatedUser);

});



// DELETE USER
router.delete("/users/:id", async (req, res) => {

    await User.findByIdAndDelete(req.params.id);

    res.json({

        message:"User Deleted"

    });

});



module.exports = router;