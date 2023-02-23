require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Router = require("./routes/routes.js");
const errorMiddleware = require("./middleware/error-middleware.js");
const PORT = process.env.PORT || 5000;
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});
app.use(Router);
app.use(errorMiddleware);

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
