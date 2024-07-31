import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

export const DYNAMO_CLIENT = new DynamoDBClient({
  region: process.env.ENVIRONMENT_REGION,
});

export const remoteItemHandler = async ({ userId, id }) => {
  try {
    const result = await DYNAMO_CLIENT.send(
      new DeleteItemCommand({
        TableName: process.env.DYNAMODB_NAME,
        Key: {
            "userId": {
                S: userId
            },
            "todoId": {
                S: id
            }
        }
      })
    );

    return {
      statusCode: result["$metadata"].httpStatusCode,
      //   item: {
      //     token: result.Item.id.S,
      //     email: result.Item.email.S,
      //     userId: result.Item.userId.S,
      //     timestamp: result.Item.timestamp.S,
      //   },
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
