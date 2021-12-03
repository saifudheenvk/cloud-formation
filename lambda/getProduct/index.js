"use strict";
const AWS = require("aws-sdk");
AWS.config.update({ region: "ap-south-1" });

exports.handler = async (event, context) => {
  //event contains request body and other url realted info
  //context contains methods, and properties
  var docClient = new AWS.DynamoDB.DocumentClient();
  let responseBody = "";
  let statusCode = 0;
  const params = {
    TableName: "Products",
  };

  try {
    const data = await docClient.scan(params).promise();
    responseBody = JSON.stringify(data.Items);
    statusCode = 200;
  } catch (error) {
    console.log(error);
    responseBody = "Unable to get products";
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
