const express = require("express")
const { PostModel } = require("../models/post.model")
const { auth } = require("../middleware/auth.middleware")
const postRouter = express.Router()
postRouter.use(auth)
postRouter.post("/add", async (req, res) => {
    try {
        const post = new PostModel(req.body)
        await post.save()
        res.status(200).json({ msg: "New Post Added", post: req.body })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

postRouter.get("/",async(req,res)=>{
    const userID=req.body.userID
    console.log(userID)
    try {
        const posts=await PostModel.find({userID}).limit(3)
        if(posts.length>0){
            res.status(200).json({posts:posts})
        }else{
            res.status(200).json({msg:"Post not found"})
        }
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

postRouter.patch("/update/:postID", async (req, res) => {
    const userID = req.body.userID
    const { postID } = req.params;
    try{
        const post = await PostModel.findOne({ _id:postID })
        const userIDinPost = post.userID
        if (userID == userIDinPost) {
            await PostModel.findByIdAndUpdate({ _id: postID }, req.body)
            res.status(200).json({ msg: `${post.title} has been updated` })
        } else {
            res.status(400).json({ error: "Not Authorized" })
        }
    } catch (error) {
        console.log("in error")
        res.status(400).json({ error: error.message })
    }
})

postRouter.delete("/delete/:postID", async (req, res) => {
    const userID = req.body.userID
    const { postID } = req.params;
    try {
        const post = await PostModel.findOne({ _id:postID })
        const userIDinPost = post.userID
        if (userID == userIDinPost) {
            await PostModel.findByIdAndDelete({ _id: postID })
            res.status(200).json({ msg: `${post.title} has been deleted` })
        } else {
            res.status(400).json({ error: "Not Authorized" })
        }
    } catch (error) {
        res.status(400).json({ error:error.message })
    }
})

module.exports = {
    postRouter
}
