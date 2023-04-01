const jwt = require("jsonwebtoken");
const Blocklist = require("./models/Blocklist");

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    Blocklist.findOne({ where: { token } }).then((blocklist) => {
      if (blocklist) {
        return res.status(403).send("Forbidden");
      }
    });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      console.log(err);
      return res.status(403).send("Forbidden");
    }
  });
}

module.exports = verifyToken;
