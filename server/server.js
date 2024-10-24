require("dotenv").config()
const OpenAI = require("openai")
const express = require("express")
const axios = require("axios")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json())

app.use(cors());

const API_KEY = process.env.API_KEY;

//connecting to mongodb
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

//defining a schema
const summarySchema = new mongoose.Schema({
    text: String,
    summarizedText: String
})

//defining a model for schema
const Summary = mongoose.model("Summary", summarySchema)

app.post("/api/summarize", async(req, res)=> {
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
        const newSummary  = new Summary({text, summarizedText})
        await newSummary.save()

        res.json({summary: summarizedText})
    }
    catch(error){
        console.error("Error Calling OpenAI API:", error)
        res.status(500).json({error: "Internal Server Error"})
    }
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})