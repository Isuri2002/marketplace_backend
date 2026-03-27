const mongoose = require("mongoose");
const config = require("./config");

const GLOBAL_CONN_KEY = "__RENTAL_MARKET_MONGO_CONN__";

const connectDatabase = async () => {
  if (global[GLOBAL_CONN_KEY]) {
    return global[GLOBAL_CONN_KEY];
  }
  const connection = await mongoose.connect(
    config.mongoose.url,
    config.mongoose.options,
  );
  global[GLOBAL_CONN_KEY] = connection;
  return connection;
};

module.exports = { connectDatabase };
