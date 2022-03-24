const mongoose = require("mongoose");
const Users = require("../models/mongo.users");

const mongoConnection = () => {
  mongoose
    .connect("mongodb://mongo:27017/docker-mode-mongo", {
      useNewUrlParser: true,
    })
    .then(() => console.log("MongoDB Connected.................."))
    .catch((err) => console.log(err));
};
const createUserMongo = (name) => {
  const newUser = new Users({ name: name });
  newUser
    .save()
    .then((item) => {
      Users.find({}, (err, docs) => {
        if (err) console.log("err " + err);
        console.log(docs);
      });
      console.log("Mongo create : " + name);
      return true;
    })
    .catch((err) => console.log(err));
};

const getUsersMongo = async () => {
  return await new Promise((resolve, reject) => {
    Users.find({})
      .limit(3)
      .sort('-date')
      .then((result, ) => {
        resolve(result);
      });
  });
};

module.exports = {
  createUserMongo,
  getUsersMongo,
  mongoConnection,
};
