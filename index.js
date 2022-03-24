const express = require("express");
const bodyParser = require("body-parser");
const MongoDB = require("./queries/mongo.connection");
const postgres = require("./queries/postgres.connection");
const consumer = require("./consumer");
const publisher = require('./publisher');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

MongoDB.mongoConnection();
postgres.executePostgres().then((result) => {
  if (result) {
    console.log("Table created success");
  }
});

consumer.consumerA();
consumer.consumerB();

app.get("/", (req, res) => {
  res.send("hasdoasd");
});

app.post("/producer", async (req, res) => {
  await publisher.publishToQueue(req.body);
  res.status(200).json({ msg: true });
});

app.get("/users", async (req, res) => {
  let arrPromise = [
    new Promise(async (resolve, reject) => {
      const data = await MongoDB.getUsersMongo();
      resolve(data ?? []);
    }),
    new Promise(async (resolve, reject) => {
      const data = await postgres.getUsersPostgres();
      resolve(data ?? []);
    }),
  ];

  return await Promise.all(arrPromise)
    .then((values) => {
      const usersMongo = values[0];
      const usersPostgres = values[1];
      res.status(200).json({ mongo: usersMongo, postgres: usersPostgres });
    })
    .catch((e) => {
      throw new Error(e);
    });
});

app.listen(port, () => console.log("Server runing..." + port));
