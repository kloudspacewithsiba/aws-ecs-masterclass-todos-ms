import * as dynamoDBProvider from "../libs/dynamodb/index.js";
import * as Logger from "../utils/logger.js";
import axios from "axios";


const createUserTodo = async (req, res) => {
  try {

    const { title, description, complete } = req.body;

    const { userId } = req;

    const result = await dynamoDBProvider.putItemHandler({ userId, title, description, complete })

    Logger.writeLog({
      url: req.url,
      body: req.body,
      result: result,
    });

    res.status(200).json({
      message: "Item created successfully!",
    });
  } catch (error) {
    Logger.writeLog({
      url: req.url,
      body: req.body,
      error: error,
    });
    res.status(error.statusCode).json({
      type: error.type,
      message: error.message,
    });
  }
};

const getAllUserTodos = async (req, res) => {
  try {

    const { userId } = req;

    const result = await dynamoDBProvider.queryItems(userId)

    Logger.writeLog({
      url: req.url,
      body: req.body,
      result: result,
    });

    res.status(200).json({
      Items: result.items,
    });
  } catch (error) {
    Logger.writeLog({
      url: req.url,
      body: req.body,
      error: error,
    });
    res.status(error.statusCode).json({
      type: error.type,
      message: error.message,
    });
  }
};

const getUserTodoByID = async (req, res) => {
  try {

    const { id } = req.params;

    const { userId } = req;

    const result = await dynamoDBProvider.getItemHandler({ userId, id });

    Logger.writeLog({
      url: req.url,
      body: req.body,
      result: result,
    });

    res.status(200).json({
      item: result.item,
    });
  } catch (error) {
    Logger.writeLog({
      url: req.url,
      body: req.body,
      error: error,
    });
    res.status(error.statusCode).json({
      type: error.type,
      message: error.message,
    });
  }
};

const updateUserTodo = async (req, res) => {
  try {

    const { id } = req.params;

    const { userId } = req;

    const { title, description, complete } = req.body;

    const result = await dynamoDBProvider.updateItemHandler({ userId, id, title, description, complete });

    if(result.Item.complete) {
      const { data } = await axios.post(`http://${process.env.NOTIFICATION_SERVICE_URL}/api/v1/notifications/send`, {
        sourceEmailAddress: "sibabalwe47@gmail.com",
        toEmailAddresses: req.email,
        messageBody: `You've marked item - ${result.Item.todoId} as completed`,
        emailSubject: "Congratulations! You're making great."
      });
    }

    Logger.writeLog({
      url: req.url,
      body: req.body,
      result: result,
    });

    res.status(200).json({
      Item: result.Item
    });
  } catch (error) {
    Logger.writeLog({
      url: req.url,
      body: req.body,
      error: error,
    });
    res.status(error.statusCode).json({
      type: error.type,
      message: error.message,
    });
  }
};

const removeUserTodoByID = async (req, res) => {
  try {

    const { id } = req.params;

    const { userId } = req;

    const result = await dynamoDBProvider.remoteItemHandler({ userId, id })

    Logger.writeLog({
      url: req.url,
      body: req.body,
      result: result,
    });

    res.status(200).json({
      message: "Item removed successfully!",
    });
  } catch (error) {
    Logger.writeLog({
      url: req.url,
      body: req.body,
      error: error,
    });
    res.status(error.statusCode).json({
      type: error.type,
      message: error.message,
    });
  }
};

const healthCheck = async(req, res) => {
  Logger.writeLog({
    url: req.url,
    result: "OK",
    msg: "Todos service is healthy",
  });
  res.status(200).json({
    message: "OK",
  });
}

export default {
  createUserTodo,
  getAllUserTodos,
  getUserTodoByID,
  updateUserTodo,
  removeUserTodoByID,
  healthCheck
};
