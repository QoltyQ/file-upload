const express = require("express");
const app = express();
const cors = require("cors");
const authRoute = require("./routes/auth");
const fileRoute = require("./routes/file");
const verifyToken = require("./middleware");

require("dotenv").config();

app.use(express.json());
app.use(cors());

app.use("/", authRoute);
app.use("/file", verifyToken, fileRoute);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
