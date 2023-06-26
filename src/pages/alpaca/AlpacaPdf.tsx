import { Button, css, Divider, FormGroup, TextField } from "@mui/material";
import { createTheme, ThemeProvider} from "@mui/material/styles";
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

async function MainProcess(
  text: string,
  instruction: string,
  callback: (a: JSX.Element) => void,
  selected: number
) {
  return await postData("http://172.30.1.46:5006/alpacapdf", { text, instruction, selected })
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

function AlpacaPdf(props: Props) {
  const [text, setText] = useState("");
  const [instruction, setInstruction] = useState("");
  const [output, setOutput] = useState(<div></div>);
  const [selected, setSelected] = useState(0)
  return (
  <div style={{
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    display: "flex",
    flexDirection: "row",
  }}>
    <div
      style={{
        // width: "80%",
        paddingLeft: "10%",
        paddingRight: "10%",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
          MainProcess(text, instruction, setOutput, selected);
        }}
      >
        <h2 style={{ textAlign: "center" }}>Alpaca-7b Pdf</h2>
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
      >{output}
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
        }}>
        <p style={{}}>
          <span style={{fontWeight: "bold"}}>Example 1:</span> Give me summary of the story.
        </p>
        <Divider></Divider>
        <p style={{}}>
          <span style={{fontWeight: "bold"}}>Example 2:</span> Generate some question based on the story.
        </p>
        <Divider></Divider>
        <p style={{}}>
          <span style={{fontWeight: "bold"}}>Example 3:</span> Who is the main character of this story?
        </p>
      </div>
    </div>
    <div style={{
        // paddingTop: "70px",
        width: "300px",
        height: "100%", 
        alignItems: "center",
        justifyContent: "flex-start",
        display: "flex",
        flexDirection: "column",
      }}>
      <div style={{
        // paddingTop: "40px",
        width: "300px",
        height: "300px", 
        alignItems: "center",
        justifyContent: "flex-start",
        display: "flex",
        flexDirection: "column",
      }}> 
        <h3>Select the essay</h3>
        <Button onClick={()=>setSelected(0)} style={{ width: "100%", height: "50px", textTransform: "none", fontSize: "20px", color: "black", backgroundColor: selected == 0 ? "grey" :"white", borderColor: "black", marginBottom: "10px"}} variant="outlined"> Pinocchio Ch 1-7 </Button>
        <Button onClick={()=>setSelected(1)} style={{ width: "100%", height: "50px", textTransform: "none", fontSize: "20px", color: "black", backgroundColor: selected == 1 ? "grey" :"white", borderColor: "black", marginBottom: "10px"}} variant="outlined"> Harry Potter Ch 1 </Button>
        <Button onClick={()=>setSelected(2)} style={{ width: "100%", height: "50px", textTransform: "none", fontSize: "20px", color: "black", backgroundColor: selected == 2 ? "grey" :"white", borderColor: "black", marginBottom: "10px"}} variant="outlined"> Alpaca 7b </Button>
        
      </div>
    </div>
   
  </div>
    
  );
}


export default AlpacaPdf;
