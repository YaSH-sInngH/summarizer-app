import axios from 'axios'
import React, { useState } from 'react'

function App() {

  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");

  const summarizeText = async ()=> {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/summarize`,
        { text: inputText }
      );
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error calling backend api:', error.response ? error.response.data : error.message);
    }
  }
  return (
    <div>
      <h1>TextSummarizer</h1>
      <textarea
        rows = "10"
        cols = "50"
        value = {inputText}
        onChange={(e)=>setInputText(e.target.value)}
      ></textarea>
      <br/>
      <button onClick={summarizeText}>Summarize</button>
      <h2>Summary:</h2>
      <p>{summary}</p>
    </div>
  )
}

export default App