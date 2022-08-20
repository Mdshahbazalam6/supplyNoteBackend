const express = require('express');
const cors = require('cors')
const connectToDatabase = require('./database/index')
const userRoute = require('./router/user')



const app = express();
app.use(cors())
app.use(express.json())


app.use(userRoute)
connectToDatabase().then(() => {

    app.listen(8081, () => {
        console.log('Server is running at 8081')
    })
})