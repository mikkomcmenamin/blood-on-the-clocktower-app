'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./trpc-server-adapters-aws-lambda.cjs.prod.js");
} else {
  module.exports = require("./trpc-server-adapters-aws-lambda.cjs.dev.js");
}
