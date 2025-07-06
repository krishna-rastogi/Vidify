const express = require("express");
const {createServer} = require("node:http");

const mongoose = require("mongoose");
const connectToSocket = require("./src/controllers/socketManager.js");

const cors = require("cors");
const userRoutes = require("./src/routes/usersRoute.js");

require("dotenv").config();

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.use(express.json());


app.set("port", (process.env.PORT || 8080));
app.use(cors());

const mongoURL = process.env.MONGODB_URL;

app.use("/", userRoutes);

mongoose
  .connect(mongoURL)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

server.listen(app.get("port"), () =>{
    console.log("App running");
});
