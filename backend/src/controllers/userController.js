const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/userModel");
const Meeting = require("../models/meetingModel");
const { httpStatus } = require("http-status-codes");

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Please provide username and password" });

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (await bcrypt.compare(password, user.password)) {
      let token = crypto.randomBytes(20).toString("hex");

      user.token = token;
      await user.save();

      return res.status(200).json({ token: token });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    return res.status(500).json({ message: `Something went wrong ${err}` });
  }
};

const register = async (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      username: username,
      password: hashedPassword,
    });
    await newUser.save();

    return res.status(201).json({ message: "User registered" });
  } catch (err) {
    return res.status(500).json({ message: `Something went wrong ${err}` });
  }
};

const getUserHistory = async(req, res)=>{
  const {token} = req.query;

  try {
    const user = await User.findOne({token: token});
    const meetings = await Meeting.find({userId: user.username});
    res.json(meetings);
  } catch (error) {
    res.json({message: `Something went wrong ${error}`});
  }
}

const addToHistory = async(req, res) => {
  const {token, meeting_code} = req.body;
  try {
    const user = await User.findOne({token: token});
    const newMeeting = new Meeting({
      userId: user.username,
      meetingCode: meeting_code
    })

    await newMeeting.save();
    res.status(httpStatus.CREATED).json({message: "Added code to history"});
  } catch (error) {
    res.json({message: `Something went wrong ${error}`});
  }
}

module.exports = { login, register, getUserHistory, addToHistory };
