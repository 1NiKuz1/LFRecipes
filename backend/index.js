require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Router = require("./routes/routes.js");

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});
app.use(Router);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
