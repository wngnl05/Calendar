const AWS = require('aws-sdk');
require('dotenv').config("../");

// AWS DynamoDB 설정
const configureDynamoDB = () => {
    AWS.config.update({
        region: process.env.AwsRegion,
        accessKeyId: process.env.AwsAccess,
        secretAccessKey: process.env.AwsSecret,
    });
    return new AWS.DynamoDB.DocumentClient();
};

// dynamoDB 삽입 함수
const dynamoDB_Insert = async (tableName, item) => {
    const dynamoDb = configureDynamoDB();
    const params = {
        TableName: tableName,
        Item: item,
    };

    try { 
        await dynamoDb.put(params).promise() 
    } 
    catch (error) {
        console.log(error);
        return [];
    }
};

// dynamoDB 조회 함수
const dynamoDB_Get = async (tableName, key) => {
    const dynamoDb = configureDynamoDB();
    const params = {
        TableName: tableName,
        Key: key,
    };

    try {
        const data = await dynamoDb.get(params).promise();
        return data.Item || [];
    }
    catch (error) {
        console.log(error);
        return [];
    }
};

// dynamoDB 다중 조회 함수
const dynamoDB_Query = async (tableName, keyConditionExpression, expressionAttributeValues, expressionAttributeNames, filterExpression = '', filterValues = {}) => {
    const dynamoDb = configureDynamoDB();

    // 기본 params 객체
    const params = {
        TableName: tableName,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
    };

    // 추가 필터링 조건이 있다면 필터를 params에 추가
    if (filterExpression) {
        params.FilterExpression = filterExpression;
        params.ExpressionAttributeValues = { ...params.ExpressionAttributeValues, ...filterValues }; // 기존 값에 필터 값 추가
    }

    try {
        const data = await dynamoDb.query(params).promise();
        return data.Items || [];
    } 
    catch (error) {
        console.error("DynamoDB Query Error: ", error);
        return [];
    }
};


// dynamoDB 삭제 함수
const dynamoDB_Delete = async (tableName, key) => {
    const dynamoDb = configureDynamoDB();
    const params = { TableName: tableName, Key: key };

    try { 
        await dynamoDb.delete(params).promise() 
    } 
    catch (error) {
        console.log(error);
        return [];
    }
};

module.exports = { dynamoDB_Insert, dynamoDB_Get, dynamoDB_Query, dynamoDB_Delete };