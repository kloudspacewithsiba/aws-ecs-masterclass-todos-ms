import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid';

export const DYNAMO_CLIENT = new DynamoDBClient({
  region: process.env.ENVIRONMENT_REGION,
});

export const putItemHandler = async ({ userId, title, description, complete }) => {
  try {

    const todoId = uuidv4();

    const result = await DYNAMO_CLIENT.send(
      new PutItemCommand({
        TableName: process.env.DYNAMODB_NAME,
        Item: {
          userId: {
            S: userId,
          },
          todoId: {
            S: todoId,
          },
          title: {
            S: title,
          },
          description: {
            S: description
          },
          complete: {
            BOOL: complete
          },
          timestamp: {
            S: Date.now().toString(),
          },
        },
      })
    );


    return {
      statusCode: result["$metadata"].httpStatusCode,
      success: true,
    };
  } catch (error) {
    console.log("ERROR::", error)
    throw {
      statusCode: error["$metadata"].httpStatusCode,
      message: error && error.message ? error.message : "Unknown error.",
      type: error && error.__type,
    };
  }
};
