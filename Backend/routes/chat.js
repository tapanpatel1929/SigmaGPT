import express from "express";
import Thread from "../models/Thread.js"
import getOpenAIAPIResponse from "../utils/openai.js"

const router = express.Router();

//test

router.post("/test", async (req,res) => {
    try {
        const thread = new Thread({
            threadId : "xyz",
            title: "Testing New Thread2"
    });
         const response = await thread.save();
         res.send(response)
    } catch (error) {
     console.log(error);
     res.status(500).json({error:"Failed to save in Db"})   
    }
})

//Get All Threads

router.get("/thread",async (req,res) => {
    try {
       const threads =  await Thread.find({}).sort({updatedAt:-1})
       //decending order of updateAt // most recent data on top
       res.json(threads)
    } catch (error) {
     console.log(error);
     res.status(500).json({error:"Failed to fetch Threads"})    
    }
})

router.get("/thread/:threadId", async (req,res) => {
        const {threadId}=req.params

    try {
       const thread= await Thread.findOne({threadId});
       if (!thread) {
        res.status(404).json({error:"Thread is not found"})
       }

       req.json(thread.messages)
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Failed to fetch chats"})
    }
})


router.delete("/thread/:threadId",async (req,res) => {
    const {threadId}=req.params
    try {
        const deletedThread=await Thread.findOneAndDelete({threadId});
        if (!deletedThread) {
            res.status(404).json({error:"thread could not be deleted"})
        }
        res.status(200).json({sucess:"Thread Deleted "})

    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Failed to delete thread"})
        
    }
})


router.post("/chat", async(req, res) => {
    const {threadId, message} = req.body;

    if(!threadId || !message) {
        res.status(400).json({error: "missing required fields"});
    }

    try {
        let thread = await Thread.findOne({threadId});

        if(!thread) {
            //create a new thread in Db
            thread = new Thread({
                threadId,
                title: message,
                messages: [{role: "user", content: message}]
            });
        } else {
            thread.messages.push({role: "user", content: message});
        }

        const assistantReply = await getOpenAIAPIResponse(message);

        thread.messages.push({role: "assistant", content: assistantReply});
        thread.updatedAt = new Date();

        await thread.save();
        res.json({reply: assistantReply});
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "something went wrong"});
    }
});


export default router;