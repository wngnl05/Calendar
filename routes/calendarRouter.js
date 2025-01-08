const express = require('express');
const router = express.Router();

const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { dynamoDB_Insert, dynamoDB_Get, dynamoDB_Query, dynamoDB_Delete } = require('../conf/dynamoDB.js');

router.use(express.json());
router.use(async (req, res, next) => {
    if (!req.session.userName) { res.send(`<script> alert("로그인 해주세요."); window.location.href="/login" </script>`); return; }
    next();
})

// html
router.get("/", (req, res) => { res.sendFile(path.join(__dirname, '../public/calendar/calendar.html')) });


// 월 일정 조회하기
router.post("/MonthSchedule", async (req, res) => { 
    const { userName } = req.session;
    const { dateFormat } = req.body;

    const keyConditionExpression = "#userName = :userName AND begins_with(#sortKey, :prefix)";
    const filterExpression = "begins_with(#scheduleDate, :dateFormat)";
    const expressionAttributeValues = { ":userName": userName, ":prefix": "s_", ":dateFormat": dateFormat };
    const expressionAttributeNames = { "#userName": "userName", "#sortKey": "id", "#scheduleDate": "scheduleDate" };
    
    const schedules = await dynamoDB_Query( "schedule", keyConditionExpression, expressionAttributeValues, expressionAttributeNames, filterExpression, { ":dateFormat": dateFormat });
    res.json({schedules});
});

// 일정 조회하기
router.post("/DaySchedule", async (req, res) => { 
    const { userName } = req.session;
    const { dateFormat } = req.body;
    
    const keyConditionExpression = "#userName = :userName AND begins_with(#sortKey, :prefix)";
    const filterExpression = "begins_with(#scheduleDate, :dateFormat)";
    const expressionAttributeValues = { ":userName": userName, ":prefix": "s_", ":dateFormat": dateFormat };
    const expressionAttributeNames = { "#userName": "userName", "#sortKey": "id", "#scheduleDate": "scheduleDate" };
    
    const schedules = await dynamoDB_Query( "schedule", keyConditionExpression, expressionAttributeValues, expressionAttributeNames, filterExpression, { ":dateFormat": dateFormat } );
    res.json({ schedules });
});

// 일정 추가하기
router.post("/schedule", async (req, res) => { 
    try{
        const id = uuidv4()
        const {userName} = req.session;
        const {schedule, scheduleDate} = req.body;
        await dynamoDB_Insert("schedule", {userName, id: `s_${id}`, schedule, scheduleDate})
        return res.status(200).json({id})
    }
    catch(error){
        console.log("schedule POST error", error)
        return res.status(500).json({message: "server error"})
    }
});

// 일정 삭제하기
router.delete("/schedule", async (req, res) => { 
    const {userName} = req.session;
    const {id} = req.body;

    await dynamoDB_Delete('schedule', {userName, id});
    return res.json({message: "Deleted schedule"})
});


module.exports = router;