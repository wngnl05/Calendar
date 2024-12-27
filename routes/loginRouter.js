const express = require('express');
const router = express.Router();

const AWS = require('aws-sdk');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config("../..");



router.use(express.json());
router.use(async (req, res, next) => {
    if (req.session.userEmail) { return res.redirect("/calendar") }
    next();
})

// html
router.get("/", (req, res) => { res.sendFile(path.join(__dirname, '../public/login/login.html')) });



// AWS DynamoDB 설정
AWS.config.update({
    region: process.env.AwsRegion,
    accessKeyId: process.env.AwsAccess,
    secretAccessKey: process.env.AwsSecret,
});

router.post("/", async (req, res) => {
    const { userEmail, userPassword } = req.body;
    if (!userEmail || !userPassword) { return res.status(400).json({ error: "이메일과 비밀번호를 입력해주세요." }) }

    try {
        // DynamoDB에서 사용자 정보 조회
        const dynamoDB = new AWS.DynamoDB.DocumentClient();
        const result = await dynamoDB.get({
            TableName: process.env.DynamoDbName,
            Key: { userEmail: userEmail },
        }).promise();

        // 사용자가 없으면
        if (!result.Item) { return res.status(404).json({ error: "가입되지 않은 이메일입니다." }) }

        // 비밀번호 확인
        const isMatch = await bcrypt.compare(userPassword,  result.Item.userPassword);
        if (!isMatch) { return res.status(401).json({ error: "비밀번호를 확인해주세요." }) }

        // Login Session
        req.session.userEmail = userEmail;
        return res.status(200).json({ message: "로그인 되었습니다." });
    } 
    catch (error) {
        console.error("DynamoDB Error:", error);
        return res.status(500).json({ error: "서버 오류로 로그인에 실패했습니다." });
    }
});



module.exports = router;