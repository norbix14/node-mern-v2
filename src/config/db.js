import mongoose from 'mongoose';

/**
 * Connect to the database
 * 
 * @param {String} URI - URI string with the database info
*/
const connectDB = async (URI) => {
	try {
		if (!URI) {
			throw new Error('Invalid URI. Please, verify your string connection');
		}
		const opts = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		};
		const connection = await mongoose.connect(URI, opts);
		const host = connection.connection.host || '';
		const port = connection.connection.port || '';
		console.log(`MongoDB connected`);
		console.log(`Host:Port -> ${host}: ${port}`);
	} catch (error) {
		console.log('There is something wrong with MongoDB');
		console.log(`${error.message}`);
		process.exit(1);
	}
};

export default connectDB;
