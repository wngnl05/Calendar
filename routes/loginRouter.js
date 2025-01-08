const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const path = require('path');
const { dynamoDB_Insert, dynamoDB_Get, dynamoDB_Delete } = require('../conf/dynamoDB.js');


router.use(express.json());
router.use(async (req, res, next) => {
    if (req.session.userName) { return res.redirect("/calendar") }
    next();
})

// html
router.get("/", (req, res) => { res.sendFile(path.join(__dirname, '../public/login/login.html')) });





router.post("/", async (req, res) => {
    const { userName, userPassword } = req.body;
    if (!userName || !userPassword) { return res.status(400).json({ error: "닉네임과 비밀번호를 입력해주세요." }) }

    try {
        // DynamoDB에서 사용자 정보 조회
        const response = await dynamoDB_Get("user", {userName})
        if (response.length==0) { return res.status(404).json({ error: "가입되지 않은 닉네임입니다." }) }

        // 비밀번호 확인
        const isMatch = await bcrypt.compare(userPassword,  response.userPassword);
        if (!isMatch) { return res.status(401).json({ error: "비밀번호를 확인해주세요." }) }

        // Login Session
        req.session.userName = userName;
        return res.status(200).json({ message: "로그인 되었습니다." });
    } 
    catch (error) {
        console.error("DynamoDB Error:", error);
        return res.status(500).json({ error: "서버 오류로 로그인에 실패했습니다." });
    }
});


module.exports = router;