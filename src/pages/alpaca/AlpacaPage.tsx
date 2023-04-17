import { Button, css, FormGroup, TextField } from "@mui/material";
import { useState } from "react";

type Props = {};

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "text/html",
    },
    body: JSON.stringify(data),
  });
  return response; // parses JSON response into native JavaScript objects
}

interface LemmaObj {
  lemma: string;
}

async function MainProcess(
  text: string,
  instruction: string,
  callback: (a: JSX.Element) => void
) {
  return await postData("http://172.30.1.46:5005/alpaca", { text, instruction })
    .then((data) => {
      console.log(data);
      return data.json();
    })
    .then(async (data) => {
      console.log("text: ", data);
      callback(<div>{data.output}</div>);
    });
}

function AlpacaPage(props: Props) {
  const [text, setText] = useState("");
  const [instruction, setInstruction] = useState("");
  const [output, setOutput] = useState(<div></div>);
  return (
    <div
      style={{
        width: "100%",
        // height: "700px",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <form
        style={{
          width: "500px",
          // height: "1000px",
          justifyContent: "center",
          alignItems: "center",
        }}
        onSubmit={(event) => {
          event.preventDefault();
          setOutput(<></>);
          MainProcess(text, instruction, setOutput);
        }}
      >
        <h2 style={{ textAlign: "center" }}>Alpaca</h2>
        <FormGroup
          sx={{
            padding: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "primary.main",
          }}
        >
          <h3>Input</h3>
          <TextField
            // maxRows={}
            multiline={true}
            rows={7}
            size="small"
            color="primary"
            type="text"
            value={text}
            onChange={(event) => {
              setText(event.target.value);
            }}
            placeholder="Enter Text"
          ></TextField>
          <h3>Instruction</h3>
          <TextField
            // maxRows={}
            multiline={true}
            rows={7}
            size="small"
            color="primary"
            type="text"
            value={instruction}
            onChange={(event) => {
              setInstruction(event.target.value);
            }}
            placeholder="Enter Text"
          ></TextField>
          <br></br>
          <Button type="submit" variant="outlined">
            Send
          </Button>
        </FormGroup>
      </form>

      <div
        style={{
          border: "1px solid",
          borderColor: "green",
          borderRadius: 10,
          width: "500px",
          padding: 10,
          marginTop: 20,
        }}
      >
        {output}
      </div>
    </div>
  );
}

export default AlpacaPage;
