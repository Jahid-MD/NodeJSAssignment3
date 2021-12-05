const express = require("express");
const app = express();
const port = 8080;
const routes = require("./views/userRoutes");
const mongoose = require("mongoose");

app.use(express.json());

app.use(routes)

mongoose.connect("mongodb+srv://Admin:12345@cluster0.cmqnk.mongodb.net/Edyoda?retryWrites=true&w=majority")
.then( () => {
    console.log(`DB Connected`)
} ).catch( err => {
    console.log(err)
}  )



app.listen( port , () => {
    console.log(`server started running on port ${port}`)
} )