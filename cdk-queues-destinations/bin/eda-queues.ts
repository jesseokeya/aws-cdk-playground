#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TwoFunctionsQueueStack } from '../lib/two-functions-queue';
import { AsyncFunctionsStack } from '../lib/async-functions';

const app = new cdk.App();
new TwoFunctionsQueueStack(app, 'TwoFunctionsQueueStack', {});
new AsyncFunctionsStack(app, 'AsyncFunctionStack', {});
