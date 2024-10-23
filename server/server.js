require("dotnev").config()
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
const summary = mongoose.model("Summary", summaySchema)

app.post("/api/summarize", async(req, res)=> {
    const {text}
})