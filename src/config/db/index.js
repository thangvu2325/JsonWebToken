const mongoose = require('mongoose');
// connect database


async function connect (initial) {
    try{
        await mongoose.connect("mongodb+srv://thangvu2325:Thang123456@thangvu.dkhpyi4.mongodb.net/?retryWrites=true&w=majority",{
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