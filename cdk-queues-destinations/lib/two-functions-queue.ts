import { CfnOutput } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import {
	Function,
	Runtime,
	Code,
	EventSourceMapping,
} from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

export class TwoFunctionsQueueStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		/* Queue */
		const queue = new Queue(this, 'MySqsQueue');

		/* Lambda function that sends messages */
		const sender = new Function(this, 'SenderFunction', {
			code: Code.fromAsset(path.join(__dirname, '../functions')),
			runtime: Runtime.NODEJS_16_X,
			handler: 'sender.handler',
			environment: {
				QUEUE_URL: queue.queueUrl,
			},
		});

		queue.grantSendMessages(sender);

		/* Lambda function that recieves messages */
		const reciever = new Function(this, 'RecieverFunction', {
			code: Code.fromAsset(path.join(__dirname, '../functions')),
			runtime: Runtime.NODEJS_16_X,
			handler: 'reciever.handler',
		});

		const recieverEventSourceMapping = new EventSourceMapping(
			this,
			'QueueConsumerFunctionMySQSEvent',
			{
				target: reciever,
				batchSize: 1,
				eventSourceArn: queue.queueArn,
			}
		);

		/* Cloudformation outputs */
		new CfnOutput(this, 'SenderFunctionName', {
			value: sender.functionName,
			description: 'SenderFunctionName function name',
		});

		new CfnOutput(this, 'RecieverFunctionName', {
			value: reciever.functionName,
			description: 'RecieverFunction function name',
		});

		new CfnOutput(this, 'SQSqueueName', {
			value: queue.queueName,
			description: 'SQS queue name',
		});

		new CfnOutput(this, 'SQSqueueARN', {
			value: queue.queueArn,
			description: 'SQS queue ARN',
		});

		new CfnOutput(this, 'SQSqueueURL', {
			value: queue.queueUrl,
			description: 'SQS queue URL',
		});
	}
}
