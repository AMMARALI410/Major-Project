const multer = require("multer");

const cloudinary = require("cloudinary").v2;

const {

    CloudinaryStorage

} = require("multer-storage-cloudinary");



// CLOUDINARY CONFIG
cloudinary.config({

    cloud_name:process.env.CLOUD_NAME,

    api_key:process.env.API_KEY,

    api_secret:process.env.API_SECRET

});



// STORAGE
const storage = new CloudinaryStorage({

    cloudinary:cloudinary,

    params:{

        folder:"nodejs_uploads",

        allowed_formats:[

            "jpg",

            "png",

            "jpeg"

        ]

    }

});



// EXPORT
module.exports = multer({

    storage:storage

});