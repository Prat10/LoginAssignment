const mongoose = require('mongoose');
const DB = "mongodb+srv://pratyushsingh10575:Pratyush1@cluster0.edsaxkn.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('connection is successful')
}).catch((err) => {
    console.log('no connection',err);
})