const mongoose = require('mongoose');
// connect database


async function connect (initial) {
    try{
        await mongoose.connect('mongodb://localhost:27017/test_dev',{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connect thành công!')
        initial();

    }
    catch(error){
        console.log(error)
        process.exit();
    }
}


module.exports = {connect};