const express=require("express")
const { connection } = require("./db")
const { userRouter } = require("./routes/user.route")
const { postRouter } = require("./routes/post.route")
require("dotenv").config()
const app=express()
app.use(express.json())
app.use("/users",userRouter)
app.use("/posts",postRouter)
app.listen(process.env.PORT,async()=>{
    try {
        await connection
        console.log("Connected to database")
        console.log(`server is running at port ${process.env.PORT}`)
    } catch (error) {
        console.log(error.message)
        console.log("Something went wrong")
    }
})