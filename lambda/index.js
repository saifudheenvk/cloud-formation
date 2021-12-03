"use strict";
const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-2" });
var docClient = new AWS.DynamoDB.DocumentClient();

const deleteProduct = async (event, context) => {
  //event contains request body and other url realted info
  //context contains methods, and properties
  const { id } = event.pathParameters;
  let responseBody = "";
  let statusCode = 0;
  const params = {
    TableName: process.env.Product_Table,
    Key: {
      id: id,
    },
  };

  try {
    const data = await docClient.delete(params).promise();
    responseBody = JSON.stringify(data);
    statusCode = 204;
  } catch (error) {
    console.log(error);
    responseBody = "Unable to delete product data";
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

const updateProducts = async (event, context) => {
  //event contains request body and other url realted info
  //context contains methods, and properties
  const { id, productName } = JSON.parse(event.body);
  let responseBody = "";
  let statusCode = 0;
  const params = {
    TableName: process.env.Product_Table,
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

const putProducts = async (event, context) => {
  //event contains request body and other url realted info
  //context contains methods, and properties
  const { id, productName } = JSON.parse(event.body);
  let responseBody = "";
  let statusCode = 0;
  const params = {
    TableName: process.env.Product_Table,
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

const getProducts = async (event, context) => {
  //event contains request body and other url realted info
  //context contains methods, and properties
  let responseBody = "";
  let statusCode = 0;
  const params = {
    TableName: process.env.Product_Table,
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

exports.handler = async (event, context) => {
  switch (event.httpMethod) {
    case "POST":
      let respone = await putProducts(event, context);
      return respone;
    case "PATCH":
      let respone = await updateProducts(event, context);
      return respone;
    case "GET":
      let respone = await getProducts(event, context);
      return respone;
    case "DELETE":
      let respone = await deleteProduct(event, context);
      return respone;
    default:
      console.log("Couldn't find http method");
  }
};
