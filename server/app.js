const createError = require("http-errors");
const express = require("express");
const { join } = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const connectDB = require("./db");
const cors = require("cors");

const indexRouter = require("./routes/index");
const pingRouter = require("./routes/ping");
const usersRouter = require("./routes/users");
const matchHistoryRouter = require("./routes/matchHistory");

const { json, urlencoded } = express;

const { Game, gameState } = require("./engine/Game.js");
const readline = require("readline");

var app = express();
app.use(express.json({ extended: false }));
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(express.static(join(__dirname, "..", "client", "build")));
app.get("/*", (req, res) => {
  console.log("dirname ", __dirname)
  res.sendFile(path.join(__dirname, "..", "client", 'build', 'index.html'))
});
app.use("/users", usersRouter);
app.use("/ping", pingRouter);
app.use("/matches", require("./routes/matches"));
app.use(usersRouter);
app.use("/matchHistory", matchHistoryRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

connectDB();

module.exports = app;
