exports.handler = async (event, context, callback) => {
	const message = {
		MessageBody: `Message at ${Date()}`,
	};

	if (Math.random() > 0.9) {
		console.log(message);
		return { message };
	} else {
		console.log('error');
		throw new Error('ERROR!');
	}
};
