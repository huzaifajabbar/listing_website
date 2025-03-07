const mongoose = require('mongoose');

const dbUrl = process.env.ATLAS_DB_URL;

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(dbUrl).then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

module.exports = connectToDatabase;