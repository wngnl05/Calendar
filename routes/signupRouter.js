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
router.get("/", (req, res) => { res.sendFile(path.join(__dirname, '../public/signup/signup.html')) });


router.post("/", async (req, res) => {
    const {userName, userPassword} = req.body;
    if (!userName || !userPassword) { return res.status(400).json({ error: "닉네임과 비밀번호를 입력해주세요." }); }
    
    try {
        const response = await dynamoDB_Get("user", {userName})
        console.log(response)
        if(response.length!=0){ return res.status(201).json({ error: "사용중인 닉네임입니다" })  }

        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(userPassword, 10);

        // DynamoDB에 데이터 삽입
        await dynamoDB_Insert("user", {userName, userPassword: hashedPassword})
        return res.status(201).json({ message: "회원가입이 완료되었습니다." });
    } 
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: "서버 오류로 회원가입에 실패했습니다." });
    }
});


module.exports = router;