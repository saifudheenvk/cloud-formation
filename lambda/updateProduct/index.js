"use strict";
const AWS = require("aws-sdk");
AWS.config.update({ region: "ap-south-1" });

exports.handler = async (event, context) => {
  //event contains request body and other url realted info
  //context contains methods, and properties
  var docClient = new AWS.DynamoDB.DocumentClient();
  const { id, productName } = JSON.parse(event.body);
  let responseBody = "";
  let statusCode = 0;
  const params = {
    TableName: "Products",
    Key: {
      id: id,
    },
    UpdateExpression: "set productName = :name",
    ExpressionAttributeValues: {
      ":name": productName,
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const data = await docClient.update(params).promise();
    responseBody = JSON.stringify(data);
    statusCode = 204;
  } catch (error) {
    console.log(error);
    responseBody = "Unable to update product data";
    statusCode = 403;
  }

  const response = {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "access-control-allow-origin": "*",
    },
    body: responseBody,
  };
  return response;
};
