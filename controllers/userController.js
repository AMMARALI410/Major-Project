const User = require("../models/User");



// HOME PAGE
const getUsers = async (req, res) => {

    try{

        const page = req.query.page || 1;

        const limit = 3;

        const skip = (page - 1) * limit;


        const users = await User.find()

            .skip(skip)

            .limit(limit);
        
        res.render("index", {

            users:users,

            currentPage:Number(page)

        });

    }

    catch(error){

        console.log(error);

        res.send("Home Page Error");

    }

};



// ADD USER
const addUser = async (req, res) => {

    try{

        const newUser = new User({

            name:req.body.name,

            email:req.body.email,

            profileImage:req.file ? req.file.path : ""

        });

        await newUser.save();

        res.redirect("/");

    }

    catch(error){

        console.log(error);

        res.send("Add User Error");

    }

};



// SINGLE USER PROFILE
const getSingleUser = async (req, res) => {

    const user = await User.findById(

        req.params.id

    );


    res.render("profile", {

        user:user

    });

};


// DELETE USER
const deleteUser = async (req, res) => {

    try{

        await User.findByIdAndDelete(req.params.id);

        res.redirect("/");

    }

    catch(error){

        console.log(error);

        res.send("Delete Error");

    }

};



// EDIT PAGE
const editUser = async (req, res) => {

    try{

        const user = await User.findById(req.params.id);

        if(!user){

            return res.send("User Not Found");

        }

        res.send(`

            <html>

            <head>

                <title>Edit User</title>

                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                >

            </head>

            <body class="bg-light">

                <div class="container mt-5">

                    <div class="card shadow p-4">

                        <h1 class="mb-4">
                            Edit User
                        </h1>

                        <form action="/update-user/${user._id}" method="POST">

                            <div class="mb-3">

                                <input
                                    type="text"
                                    name="name"
                                    value="${user.name}"
                                    class="form-control"
                                    required
                                >

                            </div>


                            <div class="mb-3">

                                <input
                                    type="email"
                                    name="email"
                                    value="${user.email}"
                                    class="form-control"
                                    required
                                >

                            </div>


                            <button
                                type="submit"
                                class="btn btn-success w-100"
                            >
                                Update User
                            </button>

                        </form>

                    </div>

                </div>

            </body>

            </html>

        `);

    }

    catch(error){

        console.log(error);

        res.send("Edit Page Error");

    }

};



// UPDATE USER
const updateUser = async (req, res) => {

    try{

        await User.findByIdAndUpdate(req.params.id, {

            name:req.body.name,

            email:req.body.email

        });

        res.redirect("/");

    }

    catch(error){

        console.log(error);

        res.send("Update Error");

    }

};



module.exports = {

    getUsers,

    addUser,

    deleteUser,

    editUser,

    updateUser,

    getSingleUser

};