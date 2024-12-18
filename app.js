if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const path = require("path");
const ejs = require("ejs");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const flash = require("connect-flash");
require("./seeds/index");
const allcampRoute = require("./routes/allcamp");
const reviewsRoute = require("./routes/review");
const userRoute = require("./routes/users");
const User = require("./models/user");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "keyboardcat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

app.use((req, res, next) => {
  // this data we can use anywhrer in our template

  res.locals.currentUser = req.user;
  res.locals.message = req.flash("message");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoute);
app.use("/allcamp", allcampRoute);
app.use("/campgrounds/:id/reviews", reviewsRoute);
// app.get("/eee", (req, res, next) => {
//   if (3 == 5) {
//     res.send("done");
//   }
//   res.status(404);
//   throw new Error("data not found....");
// });

app.use("*", (req, res) => {
  res.status(404).send("********404********");
});
app.use((err, req, res, next) => {
  const { status = 500, message = "something wrong...." } = err;
  res.status(status).render("error", { err });
});
app.listen(3000, () => {
  console.log("server connected....");
});
