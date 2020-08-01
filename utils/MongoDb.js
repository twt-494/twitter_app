const mongoose = require('mongoose');

module.exports = {
    mongoose,
    connect: () => new Promise((resolve, reject) => {
        mongoose.Promise = Promise;
        mongoose.connect(process.env.MONGODB_URL, {useUnifiedTopology: true, useCreateIndex: true, useNewUrlParser: true}, err => {
            if (err) {
                reject(err)
            }
            resolve('Mongodb contected!')
        });
    }),
    disconnect: (done) => {
        mongoose.disconnect(done);
    }
};