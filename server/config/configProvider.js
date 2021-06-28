let config = null;

try {
  config = require(process.env.CONFIG
    ? process.env.CONFIG
    : "./config.local.js");
} catch (error) {
  console.log("Could not find config; fallback to default");
  config = require("./config.js");
}

module.exports = () => {
  return config;
};
