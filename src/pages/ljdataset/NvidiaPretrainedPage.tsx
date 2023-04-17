import { Button, FormGroup, TextField } from "@mui/material";
import Input from "@mui/material/Input";
import React, { useState } from "react";
import ReactAudioPlayer from "react-audio-player";

type Props = {};

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

function NvidiaPretrainedPage(props: Props) {
  const defaultBlob = new Blob();
  const [blob, setBlob] = useState(defaultBlob);
  const [text, setText] = useState("");
  const [hide, setHide] = useState(true);
  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
      }}
    >
      <form
        style={{
          width: "500px",
          // display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onSubmit={(event) => {
          event.preventDefault();
          postData("http://172.30.1.46:5003/", {
            text: text,
          })
            .then((data) => {
              return data.blob();
            })
            .then((blob) => {
              setBlob(blob);
              setHide(false);
            });
        }}
      >
        <h2 style={{ textAlign: "center" }}>Tacotron2 TTS</h2>
        <FormGroup
          sx={{
            padding: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "primary.main",
          }}
        >
          <TextField
            multiline={true}
            rows={5}
            size="small"
            color="primary"
            type="text"
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setHide(true);
            }}
            placeholder="Enter Text"
          ></TextField>
          <br></br>
          <Button type="submit" variant="outlined">
            Speak
          </Button>
          {hide ? null : (
            <ReactAudioPlayer src={URL.createObjectURL(blob)} controls />
          )}
        </FormGroup>
      </form>
    </div>
  );
}

export default NvidiaPretrainedPage;
