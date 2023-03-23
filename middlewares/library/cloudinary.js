const cloudinary = require("cloudinary").v2;
const asyncErrorWrapper = require("express-async-handler");

const uploadPhoto = asyncErrorWrapper(async (req, res, next) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
  });

  const { profile_image } = req.body;

  const result = await cloudinary.uploader.upload(profile_image, {
    folder: "ogretmen_getir",
    width: 300,
    crop: "scale",
  });
  req.data = result;

  next();
});

module.exports = { uploadPhoto };
