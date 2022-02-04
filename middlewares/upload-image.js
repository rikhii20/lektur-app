const multer = require("multer");
const cloudinary = require('../config/cloudinary')
const { CloudinaryStorage } = require('multer-storage-cloudinary')

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Belum ditentukan', //catatan
        format: async (req,file)=> 'png'
    }
})

module.exports = multer({storage: storage})