import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall }from "@aws-sdk/util-dynamodb";

export const DYNAMO_CLIENT = new DynamoDBClient({
  region: process.env.ENVIRONMENT_REGION,
});

export const queryItems = async (userId) => {
  try {
    const result = await DYNAMO_CLIENT.send(
      new QueryCommand({
        TableName: process.env.DYNAMODB_NAME,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": {
            S: userId
          }
        }
      })
    );

    console.log("RESULTS::", result)

    return {
      statusCode: result["$metadata"].httpStatusCode,
      items: result.Items.map((item) => unmarshall(item)),
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
