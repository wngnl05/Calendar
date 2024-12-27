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
router.get("/", (req, res) => { res.sendFile(path.join(__dirname, '../public/signup/signup.html')) });


// AWS DynamoDB 설정
AWS.config.update({
    region: process.env.AwsRegion,
    accessKeyId: process.env.AwsAccess,
    secretAccessKey: process.env.AwsSecret,
});

router.post("/", async (req, res) => {
    const {userEmail, userPassword} = req.body;
    if (!userEmail || !userPassword) { return res.status(400).json({ error: "이메일과 비밀번호를 입력해주세요." }); }
    
    try {
        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(userPassword, 10);

        // DynamoDB에 데이터 삽입
        const dynamoDB = new AWS.DynamoDB.DocumentClient();
        await dynamoDB.put({
            TableName: process.env.DynamoDbName,
            Item: {
                userEmail: userEmail,
                userPassword: hashedPassword,
                events: [],
            },
            ConditionExpression: 'attribute_not_exists(userEmail)', // userEmail이 없을 때만 삽입
        }).promise();

        return res.status(201).json({ message: "회원가입이 완료되었습니다." });
    } 
    catch (error) {
        if (error.code === 'ConditionalCheckFailedException') { return res.status(400).json({ error: "이미 가입된 이메일입니다." }) }
        return res.status(500).json({ error: "서버 오류로 회원가입에 실패했습니다." });
    }
});


module.exports = router;