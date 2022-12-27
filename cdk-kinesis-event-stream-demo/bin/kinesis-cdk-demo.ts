#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { KinesisCdkDemoStack } from '../lib/kinesis-cdk-demo-stack';

const app = new cdk.App();
new KinesisCdkDemoStack(app, 'KinesisCdkDemoStack', {});
