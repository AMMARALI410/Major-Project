const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");


// CONTROLLER IMPORT
const {

    getUsers,

    addUser,

    deleteUser,

    editUser,

    updateUser,

    getSingleUser

} = require("../controllers/userController");



// HOME
router.get("/", getUsers);


// ADD USER
router.post(

    "/add-user",

    upload.single("profile"),

    addUser

);

// SINGLE USER PROFILE
router.get(

    "/user/:id",

    getSingleUser

);


// DELETE USER
router.get("/delete-user/:id", deleteUser);


// EDIT PAGE
router.get("/edit-user/:id", editUser);


// UPDATE USER
router.post("/update-user/:id", updateUser);



// CLOUDINARY MULTIPLE UPLOAD
router.post(

    "/upload",

    upload.array("profiles", 5),

    (req, res) => {

        let images = "";


        req.files.forEach((file) => {

            images += `

                <img
                    src="${file.path}"
                    width="200"
                    style="margin:10px;"
                >

            `;

        });


        res.send(`

            <h1>
                Images Uploaded To Cloudinary
            </h1>

            ${images}

        `);

    }

);

// EXPORT ROUTER
module.exports = router;