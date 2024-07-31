import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall }from "@aws-sdk/util-dynamodb";

export const DYNAMO_CLIENT = new DynamoDBClient({
  region: process.env.ENVIRONMENT_REGION,
});

export const getItemHandler = async ({ userId, id }) => {
  try {

    const result = await DYNAMO_CLIENT.send(
      new GetItemCommand({
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

    console.log("RESULTS::", result)

    return {
      statusCode: result["$metadata"].httpStatusCode,
      item: unmarshall(result.Item),
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
