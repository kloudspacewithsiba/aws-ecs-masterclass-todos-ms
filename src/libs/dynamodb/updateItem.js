import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall }from "@aws-sdk/util-dynamodb";

export const DYNAMO_CLIENT = new DynamoDBClient({
  region: process.env.ENVIRONMENT_REGION,
});

export const updateItemHandler = async ({ userId, id, title, description, complete }) => {
  try {
    const result = await DYNAMO_CLIENT.send(
        new UpdateItemCommand({
          TableName: process.env.DYNAMODB_NAME,
          Key: {
              "userId": {
                  S: userId
              },
              "todoId": {
                  S: id
              }
          },
          UpdateExpression: "SET title = :t, description = :d, complete = :c",
          ExpressionAttributeValues: {
            ":t": {
                S: title
            },
            ":d": {
                S: description
            },
            ":c": {
                BOOL: complete
            }
          },
          ReturnValues: "ALL_NEW"
        })
      );

    console.log("RESULTS::", result)

    return {
      statusCode: result["$metadata"].httpStatusCode,
      Item: unmarshall(result.Attributes),
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
