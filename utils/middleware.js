const logger = require("./logger");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken) {
    return response.status(401).json({ error: "token invalid" });
  }
  request.user = await User.findById(decodedToken.id);
  next();
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  }
  next();
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token missing or invalid" });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  }

  next(error);
};

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor,
};
