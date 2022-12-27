const AWS = require('aws-sdk');
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

exports.handler = async (event) => {
	const params = {
		MessageBody: `Message at ${Date()}`,
		QueueUrl: process.env.QUEUE_URL,
	};

	console.log(params);

	const result = await sqs.sendMessage(params).promise();
	console.log(result);
};
