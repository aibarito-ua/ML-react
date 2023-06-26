import { Button, css, Divider, FormGroup, TextField } from "@mui/material";
import { useState } from "react";
// require('dotenv').config()

type Props = {};

interface KeyObj {
  key: number;
}

interface KeyObj {
  key: number;
}

interface PhraseObj {
  str: string;
  //0 - default. 1 - color text. 2 - color strike through text, 3 - color backround
  type: number;
  color?: string;
  hasSpaceNext: boolean;
}

const greenBack: string = "#B6E89F";
const green: string = "#35A800";
const red: string = "#DB1606";
const yellow: string = "#E2E548";
const blue: string = "#0773E0";

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

function Space(keyObj: KeyObj): JSX.Element {
  return <span key={keyObj.key++}> </span>;
}

function Default(str: string, keyObj: KeyObj): JSX.Element {
  return <span key={keyObj.key++}>{str}</span>;
}

function ColoredStrikethrough(
  str: string,
  keyObj: KeyObj,
  color: string
): JSX.Element {
  return (
    <span
      style={{ textDecoration: "line-through", color: color }}
      key={keyObj.key++}
    >
      {str}
    </span>
  );
}

function ColoredBackground(
  str: string,
  keyObj: KeyObj,
  color: string = yellow
): JSX.Element {
  return (
    <span style={{ backgroundColor: color }} key={keyObj.key++}>
      {str}
    </span>
  );
}

function Color(str: string, keyObj: KeyObj, color: string): JSX.Element {
  const returnObj: JSX.Element[] = [];
  for (let i = 0; i < str.length; i++) {
    // if (i == str.length - 1 && !!str[i].match(/^[.,:!'"?]/)) {
    //   returnObj.push(Default(str[i], keyObj));
    // } else {
    returnObj.push(
      <span style={{ color: color }} key={keyObj.key++}>
        {str[i]}
      </span>
    );
    // }
  }
  return <span key={keyObj.key++}>{returnObj}</span>;
}

function RemoveDoubleSpace(str: string): string {
  str = str.replace(/ +(?= )/g, ""); //double space
  return str;
}

function IsSentence(text: string): boolean {
  let len = 0;
  for (let i = 0; i < text.length; i++) {
    const str = text[i];
    if (str.length === 1 && str.match(/[a-z0-9]/i)) {
      len++;
    }
  }
  if (len >= 1) return true;
  return false;
}

const dotExceptions2 = ["Dr", "Jr", "Sr", "Mr", "Ms", "St", "Rd", "Co"];
const dotExceptions3 = ["Mrs", "Ave", "Inc", "Ltd"];

//Fails for:
//My age is 19. And ... (False positive, it will think "19." is middle dot)
function IsMiddleDot(text: string, i: number): boolean {
  //Hello.2.Go to school (for grammar correction)
  const re = /^([0-9]+)./;
  const re2 = /.([0-9]+)$/;
  if (i + 1 < text.length && text.substring(i + 1).match(re)) return false;
  if (text.substring(0, i).match(re2)) return false;

  //J.K. Rowling
  const re3 = /[A-Z].[A-Z]$/;
  if (text.substring(0, i).match(re3)) return true;

  //i.e.
  const re4 = /i.e$/;
  if (text.substring(0, i).match(re4)) return true;

  //U.S.A, a.m., 1.2, a.1, not U.SA. not a.pm
  if (
    i + 1 < text.length &&
    text[i + 1].match(/^[A-Z0-9]/i) &&
    !(i + 2 < text.length && text[i + 2].match(/^[A-Z]/i))
  )
    return true;

  //Mr.
  if (i - 2 >= 0 && dotExceptions2.includes(text.substring(i - 2, i)))
    return true;

  //Mrs. Ave.
  if (i - 3 >= 0 && dotExceptions3.includes(text.substring(i - 3, i)))
    return true;

  //if next NON-SPACE character after dot starts with small alphabet letter
  for (let j = i + 1; j < text.length; j++) {
    if (text[j].match(/^[a-z]/)) return true;
    if (text[j] === " ") continue;
    else break;
  }

  //get last 3 chars before dot
  let lastWordArr: string[] = ["", "", ""];
  for (let j = i - 1; j >= 0 && j >= i - 3; j--) {
    if (text[j] === " " || text[j].match(/^(\r\n|\n|\r)/)) break;
    lastWordArr[3 - (i - j)] = text[j];
  }
  let lastWord = lastWordArr.join("");

  //here we should add check if for C. there was A. and B. earlier
  //A. - Z.
  if (lastWord.length == 1 && lastWord.match(/^[A-Z]/)) return true;

  //here we should add check if for 3. there was 1. and 2. earlier
  //1. 99.
  if (lastWord.length > 0 && lastWord.length < 3 && /^\d+$/.test(lastWord))
    return true;

  //I IV XC ... rome chars
  if (
    lastWord.length > 0 &&
    lastWord.match(
      /(?<=^)M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})(?=$)/
    )
  ) {
    return true;
  }
  return false;
}

async function Middleware(
  wSentence: string,
  keyObj: KeyObj,
  prev: string
): Promise<{ returnObj: JSX.Element[]; prev: string }> {
  if (!IsSentence(wSentence))
    return { returnObj: [<span key={keyObj.key++}></span>], prev: "" };
  wSentence = wSentence.trim();
  return await postData("https://demo.ella.school:5002/sentence", {
    sentence: wSentence,
    prev: prev,
  })
    .then((data) => {
      return data.json();
    })
    .then(async (data) => {
      const inputArr: PhraseObj[] = data.data;
      const prevResponse: string = data.corrected;
      const returnObj: JSX.Element[] = [];
      inputArr.forEach((x) => {
        if (x.type == 0) {
          returnObj.push(Default(x.str, keyObj));
        } else if (x.type == 1) {
          if (x.color == null) x.color = "pink";
          returnObj.push(Color(x.str, keyObj, x.color));
        } else if (x.type == 2) {
          if (x.color == null) x.color = "pink";
          returnObj.push(ColoredStrikethrough(x.str, keyObj, x.color));
        } else if (x.type == 3) {
          if (x.color == null) x.color = "pink";
          returnObj.push(ColoredBackground(x.str, keyObj, x.color));
        } else {
          console.log(x.type);
          throw Error();
        }
        if (x.str !== " " && x.hasSpaceNext) {
          returnObj.push(Space(keyObj));
        }
      });
      return { returnObj, prev: prevResponse };
    })
    .catch((error: Error) => {
      throw new Error(
        "Could not fetch data: " + wSentence + " " + error.message
      );
    });
}

async function MainProcess(
  text: string,
  callback: (a: JSX.Element) => void,
  setBusy: (a: boolean) => void
) {
  try {
    setBusy(true);
    let keyObj: KeyObj = { key: 0 };
    text = RemoveDoubleSpace(text);
    text = text.trim();
    let i = 0;
    let wSentence: string = "";
    let prevGlobal: string = "";
    const displayArr: JSX.Element[] = [];
    while (i < text.length) {
      if (text[i].match(/^(\r\n|\n|\r)/gm)) {
        wSentence = wSentence.trim();
        if (wSentence.length > 0) {
          const { returnObj, prev } = await Middleware(
            wSentence,
            keyObj,
            prevGlobal
          );
          prevGlobal = "";
          returnObj.forEach((x) => displayArr.push(x));
          wSentence = "";
          callback(<div>{displayArr}</div>);
        }
        i++;
        prevGlobal = "";
        displayArr.push(<br key={keyObj.key++}></br>);
        callback(<div>{displayArr}</div>);
        continue;
      }
      if (text[i] === "." || text[i] === "!" || text[i] === "?") {
        let toStop = false;
        //Case tripple dot
        wSentence += text[i];
        if (
          i + 2 < text.length &&
          text[i] === "." &&
          text[i + 1] === "." &&
          text[i + 2] === "."
        ) {
          wSentence += "..";
          i += 2;
          toStop = true;
        }
        //Case ." || ..." || !"
        if (
          (i + 1 < text.length && text[i + 1] === '"') ||
          text[i + 1] == "'"
        ) {
          wSentence += text[i + 1];
          i++;
          toStop = true;
        }
        if (toStop) {
          i++;
          const { returnObj, prev } = await Middleware(
            wSentence,
            keyObj,
            prevGlobal
          );
          prevGlobal = prev;
          returnObj.forEach((x) => displayArr.push(x));
          wSentence = "";
          callback(<div>{displayArr}</div>);
          continue;
        }
        const isMiddleDot = IsMiddleDot(text, i);
        if (isMiddleDot) {
          i++;
        } else {
          i++;
          const { returnObj, prev } = await Middleware(
            wSentence,
            keyObj,
            prevGlobal
          );
          prevGlobal = prev;
          returnObj.forEach((x) => displayArr.push(x));
          wSentence = "";
          if (i < text.length && text[i].match(/^[A-Z0-9]/i)) {
            if (displayArr.length > 0) displayArr.pop();
            displayArr.push(ColoredBackground(" ", keyObj, greenBack));
          }
          callback(<div>{displayArr}</div>);
        }
      } else {
        wSentence += text[i];
        i++;
      }
    }
    if (wSentence.length > 0) {
      const { returnObj, prev } = await Middleware(
        wSentence,
        keyObj,
        prevGlobal
      );
      // cSentencePrev = correct;
      returnObj.forEach((x) => displayArr.push(x));
    }
    setBusy(false);
    callback(<div>{displayArr}</div>);
  } catch (e: any) {
    setBusy(false);
    console.log(e);
    callback(
      <div>
        {Color(
          "Cannot process inputs. Try other inputs, or try again later",
          { key: 1 },
          red
        )}
      </div>
    );
  }
}


function MyCustomGrammarly(props: Props) {
  const [text, setText] = useState("");
  const [output, setOutput] = useState(<div></div>);
  const [busy, setBusy] = useState(false);
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
          if(!busy)
            MainProcess(text, setOutput, setBusy);
        }}
      >
        <h2 style={{ textAlign: "center", fontFamily: "Optima, sans-serif"}}>Grammar Correction</h2>
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
            rows={15}
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
          <Button disabled={busy} type="submit" variant="outlined">
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
      fontWeight: "lighter"
    }}
      >
        <p style={{}}>
        <span style={{fontWeight: "bold"}}>Example 1:</span> I have read a beok, Lazy Jack. In the book “Lazy Jack” the poor boy Jack playing the hero. Howevers, Jack have an indolent disposition. So people are call him "Lazy Jack".
        </p>
        <Divider variant="middle" />
        <p style={{}}>
        <span style={{fontWeight: "bold"}}>Example 2:</span> I like all the season, but winter is my favor weather. When it snow, I like to build snowman with my friends. I make a big snowballs and use carrot and rocks for the face. Also, I like to go sled on snowy days. I like to go to the big hill by my house and race down the hills. Finally, my favorite things in winter is having snowballs fights. I like to go to playground and play with my neighbor friends. I think winter is best season for these fun activities.
        </p>
        <Divider variant="middle" />

        <p style={{}}>
        <span style={{fontWeight: "bold"}}>Example 3:</span> When planning a class trip, there are lots of places you can consider. However, I think a trip to Everland would be the best idea because there is so much to do.
First, Everland offers lots of things to do. For example, we can look at animals there. Also, we can eat snacks like popcorn, candy and hotdogs. If you don't like these things, you can always ride attractions or watch parades and fireworks. These is something for everyone!
In addition, Everland is big enough for everybody. You can bring lots of people without feeling crowded. There will be always somehing to do. Plus, there is plenty of room to hang out with friends.
In conclusion, Everland is the best place to have a class trip. There is lots to do, and it is big engouh for everyone!
        </p>
    </div>
  </div>
    
  );
}

export default MyCustomGrammarly;