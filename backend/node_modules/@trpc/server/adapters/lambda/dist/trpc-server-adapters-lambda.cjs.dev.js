'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var adapters_awsLambda_dist_trpcServerAdaptersAwsLambda = require('../../aws-lambda/dist/trpc-server-adapters-aws-lambda.cjs.dev.js');
require('../../../dist/transformTRPCResponse-36a41418.cjs.dev.js');
require('../../../dist/router-ee876044.cjs.dev.js');
require('../../../dist/resolveHTTPResponse-ab01e4b9.cjs.dev.js');
require('../../../dist/codes-130e62df.cjs.dev.js');
require('events');
require('http');
require('url');
require('../../../dist/nodeHTTPRequestHandler-9a93c255.cjs.dev.js');

/**
 * @deprecated use `aws-lambda` instead
 */

/**
 * @deprecated use `aws-lambda` instead
 */
const lambdaRequestHandler = adapters_awsLambda_dist_trpcServerAdaptersAwsLambda.awsLambdaRequestHandler;

exports.awsLambdaRequestHandler = adapters_awsLambda_dist_trpcServerAdaptersAwsLambda.awsLambdaRequestHandler;
exports.lambdaRequestHandler = lambdaRequestHandler;
