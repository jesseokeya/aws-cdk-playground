import * as cdk from 'aws-cdk-lib';
import { CfnOutput } from 'aws-cdk-lib';
import { Stream, StreamMode } from 'aws-cdk-lib/aws-kinesis';
import { Construct } from 'constructs';
import {
	Function,
	Runtime,
	Code,
	EventSourceMapping,
	StartingPosition,
} from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
export class KinesisCdkDemoStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const stream = new Stream(this, 'KDS', {
			streamName: 'my-kinesis-data-stream',
			streamMode: StreamMode.ON_DEMAND,
		});

		/* Lambda function that consumes messages from stream */
		const consumer = new Function(this, 'ConsumerFunction', {
			code: Code.fromAsset(path.join(__dirname, '../functions')),
			runtime: Runtime.NODEJS_16_X,
			handler: 'consumer.handler',
		});

		new EventSourceMapping(this, 'KDSConsumerFunctionEvent', {
			target: consumer,
			batchSize: 100,
			startingPosition: StartingPosition.LATEST,
			eventSourceArn: stream.streamArn,
		});

		stream.grantRead(consumer);

		new CfnOutput(this, 'StreamARN', {
			value: stream.streamArn,
			description: 'StreamARN',
		});
	}
}
