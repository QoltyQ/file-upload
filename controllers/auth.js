const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Blocklist = require("../models/Blocklist");

const signup = async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) {
    res.status(400).send({ message: "Login and password are required" });
    return;
  }

  const user = await User.findOne({ where: { login } });
  if (user) {
    res.status(400).send({ message: "User already exist" });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    login,
    password: hashedPassword,
  });

  const accessToken = jwt.sign(newUser.dataValues, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });

  const refreshToken = jwt.sign(newUser.dataValues, process.env.REFRESH_TOKEN, {
    expiresIn: "7d",
  });

  res.status(200).send({ accessToken, refreshToken });
};

const login = async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = await User.findOne({ where: { login } });

    if (!user) {
      return res.status(401).send("Invalid username or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send("Invalid username or password");
    }

    const accessToken = jwt.sign(user.dataValues, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    res.status(200).send({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred");
  }
};

const refreshToken = async (req, res) => {
  const { refresh_token } = req.body;
  try {
    if (!refresh_token) {
      return res.status(401).send("Unauthorized");
    }
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN);

    const user = await User.findOne({ where: { id: decoded.id } });

    const accessToken = jwt.sign(user.dataValues, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    res.send({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(403).send("Forbidden");
  }
};

const getId = async (req, res) => {
  const { id } = req.user;
  res.status(200).send(`Your id is ${id}`);
};

const logout = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  await Blocklist.create({ token });
  res.status(200).send("Logout");
};

module.exports = {
  signup,
  login,
  refreshToken,
  getId,
  logout,
};
