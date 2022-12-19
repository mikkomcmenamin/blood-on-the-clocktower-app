'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var adapters_awsLambda_dist_trpcServerAdaptersAwsLambda = require('../../aws-lambda/dist/trpc-server-adapters-aws-lambda.cjs.prod.js');
require('../../../dist/transformTRPCResponse-077b7539.cjs.prod.js');
require('../../../dist/router-aaecbe82.cjs.prod.js');
require('../../../dist/resolveHTTPResponse-9812e803.cjs.prod.js');
require('../../../dist/codes-aff770a3.cjs.prod.js');
require('events');
require('http');
require('url');
require('../../../dist/nodeHTTPRequestHandler-21707788.cjs.prod.js');

/**
 * @deprecated use `aws-lambda` instead
 */

/**
 * @deprecated use `aws-lambda` instead
 */
const lambdaRequestHandler = adapters_awsLambda_dist_trpcServerAdaptersAwsLambda.awsLambdaRequestHandler;

exports.awsLambdaRequestHandler = adapters_awsLambda_dist_trpcServerAdaptersAwsLambda.awsLambdaRequestHandler;
exports.lambdaRequestHandler = lambdaRequestHandler;
