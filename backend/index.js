const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


// Environment setup
require('dotenv').config();

const app = express();

app.use(express.json());

const corsOptions = {

    // change to "*"
	origin: ['http://localhost:8000'],
	credentials: true,
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));





// local hosting
if(require.main === module) {

	app.listen(process.env.PORT || 3000, () => {
		console.log(`API is now online on port ${process.env.PORT || 3000}`);
	})
}

module.exports = { app, mongoose };