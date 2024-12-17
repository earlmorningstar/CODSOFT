const { Types } = require("mongoose");
const { sendError } = require("./response");

const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    return sendError(res, 400, `Invalid ID: ${id}`);
  }
  next();
};

module.exports = { validateObjectId };
