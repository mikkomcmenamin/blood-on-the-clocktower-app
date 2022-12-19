'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./trpc-server-adapters-lambda.cjs.prod.js");
} else {
  module.exports = require("./trpc-server-adapters-lambda.cjs.dev.js");
}
