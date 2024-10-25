   require("dotenv").config();
   console.log("API_KEY:", process.env.API_KEY);
    console.log("MONGODB_URI:", process.env.MONGODB_URI);
   console.log("Environment Variables:", process.env);
    const OpenAI = require("openai")
    const express = require("express")
    // const axios = require("axios")
    const bodyParser = require("body-parser")
    const mongoose = require("mongoose")
    const cors = require("cors")

    const app = express();
    const PORT = process.env.PORT || 1000;

    app.use(bodyParser.json())

    app.use(cors({
        origin: '*',
    }))

    const API_KEY = process.env.API_KEY;

    //connecting to mongodb
    mongoose.connect(process.env.MONGODB_URI)

    // Event listeners to confirm connection status
    const db = mongoose.connection;
    db.on("connected", () => {
        console.log("MongoDB connected successfully.");
    });
    db.on("error", (error) => {
        console.error("MongoDB connection error:", error);
    });
    db.on("disconnected", () => {
        console.log("MongoDB disconnected.");
    });


    //defining a schema
    const summarySchema = new mongoose.Schema({
        text: String,
        summarizedText: String,
    })

    //defining a model for schema
    const Summary = mongoose.model("Summary", summarySchema)

    app.post("/api/summarize", async(req, res)=> {  
        console.log("Received request:", req.body);
        const {text} = req.body;

        const openai = new OpenAI({
            apikey: API_KEY,
        })

        try{
            const response = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system", 
                        content: `Summarize content you are provided with for a second-grade student.`,
                    },
                    {
                        role: "user",
                        content: text,
                    },
                ],
                temperature: 0.7,
                max_tokens: 64,
                top_p: 1,
            })

            const summarizedText = String(response.choices[0].message.content)
            // saving summary to mongodb
            const newSummary  = new Summary({text, summarizedText})
            await newSummary.save()

            res.json({summary: summarizedText})
        }
        catch(error){
            console.error('Error calling backend api:', error.response ? error.response.data : error.message);
            res.status(500).json({error: "Internal Server Error"})
        }
    })

    app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`)
    })