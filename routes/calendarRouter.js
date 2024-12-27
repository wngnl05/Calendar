const express = require('express');
const router = express.Router();

const path = require('path');
require('dotenv').config("../..");

router.use(express.json());
router.use(async (req, res, next) => {
    if (!req.session.userEmail) { res.send(`<script> alert("로그인 해주세요."); window.location.href="/login" </script>`); return; }
    next();
})

// html
router.get("/", (req, res) => { res.sendFile(path.join(__dirname, '../public/calendar/calendar.html')) });


router.get("/event", (req, res) => { 
    console.log("test")
});

router.post("/event", (req, res) => { 
    console.log("test")
});

router.put("/event", (req, res) => { 
    console.log("test")
});

router.delete("/event", (req, res) => { 
    console.log("test")
});


module.exports = router;