"use strict";
const AWS = require("aws-sdk");
AWS.config.update({ region: "ap-south-1" });

exports.handler = async (event, context) => {
  //event contains request body and other url realted info
  //context contains methods, and properties
  var docClient = new AWS.DynamoDB.DocumentClient();
  const { id,productName } = JSON.parse(event.body);
  let responseBody = "";
  let statusCode = 0;
  const params = {
    TableName: "Products",
    Item: {
      id: id,
      productName: productName,
    },
  };

  try {
    const data = await docClient.put(params).promise();
    console.log(data);
    responseBody = JSON.stringify(data.Item);
    statusCode = 201;
  } catch (error) {
    console.log(error);
    responseBody = "Unable to put product data";
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
