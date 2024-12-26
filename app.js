const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const path = require('path');
require('dotenv').config("./");

// express 기본 설정
const app = express();
app.use(cookieParser()); // 쿠키
app.use(bodyParser.json());
app.use(express.json());



// routes
app.use("/", require("./routes/indexRouter.js"));
// app.use("/login", require("./routes/loginRouter.js"));
// app.use("/signup", require("./routes/signupRouter.js"));

// static
app.use(express.static(path.join(__dirname, 'public')));



// Helacth Check
app.get("/health", (req, res) => { res.json({status: "ok"}) });

// Redirect
app.use((req, res, next) => { res.redirect('/') });

// Run App
app.listen(8080, () => { console.log(`http://localhost:8080/`) });