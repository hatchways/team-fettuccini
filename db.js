const mongoose = require('mongoose');
require('dotenv').config();
const db = process.env.MONGO_LOCAL;

console.log("Connecting to: " + db);
const connectDB = async () => {
	try {
		console.log("Connecting...");
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		console.log('MongoDB Connected...');
	} catch (err) {
		console.error(err.message);
		process.exit(1);
	}
}

module.exports = connectDB;
