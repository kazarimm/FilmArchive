const mongoose = require('mongoose');

module.exports = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB could not connect:", error);
    }
};
