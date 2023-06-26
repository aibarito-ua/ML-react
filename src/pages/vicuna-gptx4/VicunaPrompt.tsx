import { Refresh, TrendingDown, VolumeUp } from "@mui/icons-material";
import { Box, Button, css, Divider, FormGroup, Grid, Input, Slider, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { SliderCustom } from "./slider.component";
// require('dotenv').config()

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response; // parses JSON response into native JavaScript objects
}

async function getData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
  return response; // parses JSON response into native JavaScript objects
}

function send(prompt: string, 
  temperature: number, 
  top_p: number, 
  max_new_tokens: number, 
  chat_prompt_size: number, 
  repetition_penalty: number,
  top_k: number){
   postData("http://demo.ella.school:5011/json/write", 
   {prompt, temperature, top_p, max_new_tokens, chat_prompt_size, repetition_penalty, top_k});
}

let done = false;
let tries = 0
function VicunaPrompt(props: any) {
  const text = "child name must be {CHILDNAME}, ai name must be {AINAME}"
  const [prompt, set_prompt] = useState("");
  const [top_p, set_top_p] = useState(-1);
  const [temperature, set_temperature] = useState(-1);
  const [chat_prompt_size, set_chat_prompt_size] = useState(-1);
  const [max_new_tokens, set_max_new_tokens] = useState(-1);
  const [repetition_penalty, set_repetition_penalty] = useState(-1);
  const [top_k, set_top_k] = useState(-1);
  const [received, set_received] = useState(false);
  if(!received) getData("http://demo.ella.school:5011/json/read").then(rsp=> rsp.json()).then(data=>{
    set_prompt(data.prompt);
    set_top_p(data.top_p);
    set_temperature(data.temperature);
    set_chat_prompt_size(data.chat_prompt_size);
    set_max_new_tokens(data.max_new_tokens);
    set_repetition_penalty(data.repetition_penalty);
    set_top_k(data.top_k);
    set_received(true)
  })
  return (
    <div style={{
      width: "100%",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      display: "flex",
      flexDirection: "column",
      paddingLeft: "10%",
    }}>
      <form
        style={{
          width: "800px",
          // height: "1000px",
          justifyContent: "center",
          alignItems: "center",
        }}
        onSubmit={(event) => {
          event.preventDefault();
          send(prompt,temperature, top_p, max_new_tokens, chat_prompt_size, repetition_penalty, top_k);
        }}
      >
        <h2 style={{ textAlign: "center", fontFamily: "Optima, sans-serif"}}>VicunaPrompt GPTx-4</h2>
        <div style={{marginBottom: 10}}> <span style={{fontSize: 20, fontWeight: "bold" }}>Prompt</span>: <span style={{fontSize: 15, fontWeight: "bold", }}> ({text})</span></div>
        <TextField
          fullWidth
            multiline={true}
            rows={15}
            style={{marginBottom: 20}}
            size="small"
            color="primary"
            type="text"
            value={prompt}
            onChange={(event) => {
              set_prompt(event.target.value)
            }}
            placeholder="Enter Text"
          ></TextField>
         <SliderCustom value={temperature} setValue={set_temperature} title={"Temperature"} min={0} max={1} step={0.01}></SliderCustom>
         <SliderCustom value={top_p} setValue={set_top_p} title={"Top P"} min={0} max={1} step={0.01}></SliderCustom>
         <SliderCustom value={top_k} setValue={set_top_k} title={"Top K"} min={0} max={100} step={1}></SliderCustom>
         <SliderCustom value={max_new_tokens} setValue={set_max_new_tokens} title={"Max New Tokens"} min={16} max={1024} step={2}></SliderCustom>
         <SliderCustom value={chat_prompt_size} setValue={set_chat_prompt_size} title={"Chat Prompt Size"} min={16} max={2048} step={4}></SliderCustom>
         <SliderCustom value={repetition_penalty} setValue={set_repetition_penalty} title={"Repetition Penalty"} min={0} max={2} step={0.01}></SliderCustom>
          <br></br>
          <Button type="submit" variant="outlined">
            Save
          </Button>
      </form>
  </div>
    
  );
}

export default VicunaPrompt;