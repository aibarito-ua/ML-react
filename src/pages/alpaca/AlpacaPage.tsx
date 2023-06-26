import { Button, css, Divider, FormGroup, TextField } from "@mui/material";
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
  return await postData("http://172.30.1.46:5009/alpaca", { text, instruction })
    .then((data) => {
      console.log(data);
      return data.json();
    })
    .then(async (data) => {
      console.log("text: ", data);
      callback(<div>{data.output}</div>);
    }).catch((e:any)=>{
      callback(<div>Server is not running</div>)
    });
}

function AlpacaPage(props: Props) {
  const [text, setText] = useState("");
  const [instruction, setInstruction] = useState("");
  const [output, setOutput] = useState(<div></div>);
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
          setOutput(<></>);
          MainProcess(text, instruction, setOutput);
        }}
      >
        <h2 style={{ textAlign: "center" }}>Alpaca-7b Chatbot</h2>
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
          width: "800px",
          padding: 10,
          marginTop: 20,
        }}
      >
        {output}
      </div>
      <div
    style={{
      border: "1px solid",
      borderColor: "grey",
      borderRadius: 10,
      width: "800px",
      padding: 10,
      marginTop: 20,
      fontSize: 15,
      // fontWeight: "lighter"
    }}
      >
        <p style={{}}>
        <span style={{fontWeight: "bold"}}>Example:</span> 
        <p><span style={{fontWeight: "bold"}}>Input:</span> Who are your best friends</p>
        <p><span style={{fontWeight: "bold"}}>Instruction:</span> You are a Harry Potter</p>
        <p><span style={{fontWeight: "bold"}}>Result:</span> My best friends are Ron Weasley and Hermione Granger.</p>
        </p>
    </div>
    </div>
  );
}

export default AlpacaPage;
