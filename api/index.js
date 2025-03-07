const { createServer } = require("@vercel/node");
const app = require("./app");  // Load your Express app

module.exports = createServer(app); 