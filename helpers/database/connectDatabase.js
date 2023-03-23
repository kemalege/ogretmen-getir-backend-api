const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDb connection Succesful");
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = connectDatabase;