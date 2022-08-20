const mongoose = require('mongoose')

async function connect() {
    try {
        // await mongoose.connect('mongodb://localhost:27017/SupplyNote')
        await mongoose.connect('mongodb+srv://85325696:jqCveeYX@cluster0.cucmjwy.mongodb.net/?retryWrites=true&w=majority')

        console.log('Database Connection Successfull...')
    } catch (error) {
        console.log('error in Connecting to Database')
    }
}

module.exports = connect