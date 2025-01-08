const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const path = require('path');
require('dotenv').config("./");



// express 기본 설정
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
// Session
app.use(
    session({
      store: new FileStore({
        path: './sessions',
        logFn: function () {},
        ttl: 1000 * 60 * 60 * 24,
      }),
      secret: 'calendar',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
    })
);



// routes
app.use("/calendar", require("./routes/calendarRouter.js"));
app.use("/login", require("./routes/loginRouter.js"));
app.use("/signup", require("./routes/signupRouter.js"));

// static
app.use(express.static(path.join(__dirname, 'public')));



// logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {});
    Object.keys(req.cookies).forEach(cookie => res.clearCookie(cookie));
    res.redirect("/login")
});

// Helacth Check
app.get("/health", (req, res) => { res.json({status: "ok"}) });

// Redirect
app.use((req, res, next) => { res.redirect('/login') });
// Run App
app.listen(8080, () => { console.log(`http://localhost:8080/`) });