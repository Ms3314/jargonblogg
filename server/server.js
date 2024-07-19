import express from "express"
import mongoose from "mongoose";
import 'dotenv/config'


const app = express()

let PORT = 3000;



mongoose.connect(process.env.DB_LOCATION)
.then(() => {
    console.log("Connected to database")
})
// IF its saying that we cannot send a callback in the connect stmt then i just use a then statemnt 

app.use(express.json());

app.get("/" , (req ,res) => {

    res.send("Hello World") }
)
app.post("/signup" , (req ,res) => {
    res.json(req.body)
    console.log("some data has been send ")
})

app.listen(PORT , () => {
    console.log("Server is running on port " + PORT)
})