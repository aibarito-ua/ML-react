import { Button, css, FormGroup, TextField } from "@mui/material";
import { useState } from "react";

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

interface LemmaObj {
  lemma: string;
}

const green: string = "#6DF37B";
const red: string = "#F56C68";
const yellow: string = "#E2E548";

async function getLemmas(str: string): Promise<LemmaObj[]> {
  const url: string = "https://demo.ella.school:22111/nest/testSDGC";
  const data = {
    text: str,
  };
  return await postData(url, data)
    .then((data) => data.json())
    .then((data) => {
      console.log("Lemma str: ", str);
      console.log("Lemma result: ", data[0]);
      const arr: LemmaObj[][] = data[0].dependency_result;
      const lemmas: LemmaObj[] = [];
      for (let i = 0; i < arr.length; i++) {
        lemmas.push(arr[i][0]);
      }
      return lemmas;
    });
}

function similarity(s1: string, s2: string) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength: number = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / longerLength;
}

function editDistance(s1: string, s2: string) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

function areSimilar(a: string, b: string): boolean {
  return similarity(a, b) > 0.5;
}

function MyMapSet(map: Map<string, number>, key: string) {
  if (map.has(key)) map.set(key, map.get(key)! + 1);
  else map.set(key, 1);
}

function AreMapsSame(
  map1: Map<string, number>,
  map2: Map<string, number>
): boolean {
  let testVal;
  if (map1.size !== map2.size) {
    return false;
  }
  map1.forEach((val: number, key: string) => {
    testVal = map2.get(key);
    if ((testVal === undefined && !map2.has(key)) || testVal !== val) {
      return false;
    }
  });
  return true;
}

const AreSetsSame = (xs: Set<number>, ys: Set<number>) => {
  if (xs.size != ys.size) return false;
  let toFalse: boolean = true;
  xs.forEach((x) => {
    if (!ys.has(x)) toFalse = false;
  });
  return toFalse;
};

function getRandomColor() {
  var letters = "BCDEF".split("");
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

function beautifyQuotes(str: string): string {
  str = beautifyString(str);
  let cnt = 0;
  let newStr: string = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i] == '"') {
      if (cnt % 2 == 1) {
        //right quote 'hello " '
        //must not have space before
        if (i != 0 && str[i - 1] === " ") {
          newStr = newStr.slice(0, -1);
          newStr += str[i];
        } else {
          newStr += str[i];
        }
        //must have space after
        if (i + 1 < str.length && str[i + 1] !== " ") {
          newStr += " ";
        }
      } else {
        //left quote 'p" hello '
        //must have space before
        if (i != 0 && str[i - 1] !== " ") {
          newStr += " ";
          newStr += str[i];
        } else {
          newStr += str[i];
        }
        //must not have space after
        if (i + 1 < str.length && str[i + 1] === " ") {
          i++;
        }
      }
      cnt++;
    } else {
      newStr += str[i];
    }
  }
  str = newStr;
  cnt = 0;
  newStr = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '"') {
      if (cnt % 2 == 1) {
        //right quote 'hello." '
        //must not have dot before
        if (i != 0 && str[i - 1].match(/^[.,!?]/)) {
          newStr = newStr.slice(0, -1);
          newStr += '"';
          newStr += str[i - 1];
        } else {
          newStr += '"';
        }
        //must have space after
        if (i + 1 < str.length && str[i + 1] !== " ") {
          newStr += " ";
        }
      } else {
        newStr += '"';
      }
      cnt++;
    } else {
      newStr += str[i];
    }
  }
  return newStr;
}

function dePunctuate(str: string): string {
  str.trim();
  const punctuationless = str.replace(/[.,\/#?!$%\^&\*;:'"{}=\-_`~()]/g, "");
  return punctuationless.replace(/\s{2,}/g, " ");
}

function beautifyString(str: string): string {
  if (str.length == 0) return "";
  str.trim();
  str = str.replace("“", '"');
  str = str.replace("”", '"'); // weirds quotes
  str = str.replace(" ", " "); //weirds spaces
  str = str.replace(/\s{2,}/g, " "); //double space
  let newStr = "";
  for (let i = 0; i < str.length; i++) {
    if (!!str[i].match(/^[.,:!?]/)) {
      if (i == 0) continue;
      else if (str[i - 1] === " ") {
        newStr = newStr.slice(0, -1);
      }
      newStr += str[i];
      if (i + 1 < str.length && str[i + 1] !== " ") {
        newStr += " ";
      }
    } else {
      newStr += str[i];
    }
  }
  return newStr;
}

function Space() {
  return <span> </span>;
}

function Default(str: string) {
  return <span>{str}</span>;
}

function Strikethrough(str: string) {
  return <span style={{ textDecoration: "line-through" }}>{str}</span>;
}

function ColoredStrikethrough(str: string, color: string) {
  return (
    <span style={{ textDecoration: "line-through", backgroundColor: color }}>
      {str}
    </span>
  );
}

function Color(str: string, color: string) {
  const returnObj: JSX.Element[] = [];
  for (let i = 0; i < str.length; i++) {
    if (i == str.length - 1 && !!str[i].match(/^[.,:!'"?]/)) {
      returnObj.push(Default(str[i]));
    } else {
      returnObj.push(<span style={{ backgroundColor: color }}>{str[i]}</span>);
    }
  }
  return <span>{returnObj}</span>;
}

function ProcessLemmas(
  wLemmas: LemmaObj[],
  cLemmas: LemmaObj[]
): { wLemmaMap: number[]; cLemmaMap: number[] } {
  const wn = wLemmas.length;
  const cn = cLemmas.length;
  const wLemmaMap: number[] = new Array(wn);
  const cLemmaMap: number[] = new Array(cn);
  wLemmaMap.fill(-1);
  cLemmaMap.fill(-1);
  for (let i = 0; i < wn; i++) {
    const wrongLemma: string = wLemmas[i].lemma;
    for (let j = Math.max(0, i - 2); j <= Math.min(cn, i + 2); j++) {
      if (
        cLemmaMap[j] === -1 &&
        wrongLemma.toLowerCase() === cLemmas[j].lemma.toLowerCase()
      ) {
        wLemmaMap[i] = j;
        cLemmaMap[j] = i;
        break;
      }
    }
  }
  for (let i = 0; i < wn; i++) {
    const wrongLemma: string = wLemmas[i].lemma;
    if (wLemmaMap[i] === -1) {
      for (let j = Math.max(0, i - 2); j <= Math.min(cn, i + 2); j++) {
        if (cLemmaMap[j] === -1 && areSimilar(wrongLemma, cLemmas[j].lemma)) {
          wLemmaMap[i] = j;
          cLemmaMap[j] = i;
          break;
        }
      }
    }
  }
  for (let i = 0; i < wn; i++) {
    if (wLemmaMap[i] === -1) {
      for (let j = Math.max(0, i - 4); j <= Math.min(cn, i + 4); j++) {
        if (
          cLemmaMap[j] == -1 &&
          areSimilar(wLemmas[i].lemma, cLemmas[j].lemma)
        ) {
          wLemmaMap[i] = j;
          cLemmaMap[j] = i;
          break;
        }
      }
    }
  }
  return { wLemmaMap, cLemmaMap };
}

function IsSentence(text: string): boolean {
  let len = 0;
  for (let i = 0; i < text.length; i++) {
    const str = text[i];
    if (str.length === 1 && str.match(/[a-z]/i)) {
      len++;
    }
  }
  if (len > 2) return true;
  return false;
}

// function GetCorrectSentenceFrom(text: string): string {
//   let correct: string = "";
//   let start: boolean = true;
//   for (let i = 0; i < text.length; i++) {
//     if (start) {
//       correct += text[i];
//     } else if (text[i] === ".") {
//       start = false;
//     }
//   }
//   return correct;
// }

async function MainProcess(text: string, callback: (a: JSX.Element) => void) {
  const textNoNewLines = text.replace(/(\r\n|\n|\r)/gm, "").trim();
  let i = 0;
  let wSentence: string = "";
  let cSentencePrev: string = "";
  const returnObj: JSX.Element[] = [];
  while (i < textNoNewLines.length) {
    if (
      textNoNewLines[i] === "." ||
      textNoNewLines[i] === "!" ||
      textNoNewLines[i] === "?"
    ) {
      wSentence += textNoNewLines[i];
      const { obj } = await Middleware2(wSentence);
      // cSentencePrev = correct;
      obj.forEach((x) => returnObj.push(x));
      wSentence = "";
      callback(<div>{returnObj}</div>);
    } else {
      wSentence += textNoNewLines[i];
    }
    i++;
  }
  if (wSentence.length > 0) {
    const { obj } = await Middleware2(wSentence);
    // cSentencePrev = correct;
    obj.forEach((x) => returnObj.push(x));
  }

  callback(<div>{returnObj}</div>);
}

//get similar sentence
async function Middleware2(wSentence: string): Promise<{ obj: JSX.Element[] }> {
  if (!IsSentence(wSentence)) return { obj: [<span></span>] };
  return await postData(
    "http://demo.ella.school:13000/unity/nlp_tool/v1/grammarCorrection/basic",
    {
      text: wSentence,
    }
  )
    .then((data) => {
      return data.json();
    })
    .then(async (data) => {
      console.log("text: ", wSentence);
      console.log("corrected: ", data.correctedSentence);
      let correctedSentence: string = data.correctedSentence;
      correctedSentence.trim();
      if (
        correctedSentence[0] === '"' &&
        correctedSentence[correctedSentence.length - 1] === '"'
      ) {
        correctedSentence = correctedSentence.slice(1, -1);
      }
      const casesToSkip: string[] = [
        "This sentence is grammatically correct as is",
        "I cannot correct this sentence",
        "I cannot correct this into a grammatically correct",
        "The original sentence is already grammatically correct",
        "already grammatically correct",
        "already a grammatically correct",
        "I cannot correct the sentence",
        "This sentence is incomplete",
        "cannot be corrected without",
      ];
      for (let case_i of casesToSkip) {
        if (correctedSentence.includes(case_i)) {
          wSentence.trim();
          return { obj: [Default(wSentence), Space()] };
        }
      }
      const obj: JSX.Element[] = await ProcessSentence(
        wSentence,
        correctedSentence
      );

      return { obj };
    });
}

function ReplaceFullSentence(
  wSentence: string,
  cSentence: string
): JSX.Element[] {
  const returnObj: JSX.Element[] = [];
  returnObj.push(ColoredStrikethrough(wSentence, red));
  returnObj.push(Space());
  returnObj.push(Color(cSentence, green));
  returnObj.push(Space());
  return returnObj;
}

function CaseSolver(
  wi: number,
  wi2: number,
  ci: number,
  ci2: number,
  returnObj: JSX.Element[],
  wWords: string[],
  cFinal: string[],
  wLemmaMap: number[],
  cLemmaMap: number[]
): void {
  for (let i = wi; i < cLemmaMap[ci]; i++) {
    returnObj.push(ColoredStrikethrough(wWords[i], red));
    returnObj.push(ColoredStrikethrough(" ", red));
  }
  returnObj.pop();
  returnObj.push(Space());
  returnObj.push(Default(cFinal[ci]));
  returnObj.push(Space());
  for (let i = ci + 1; i <= ci2; i++) {
    returnObj.push(Color(cFinal[i], green));
    returnObj.push(Color(" ", green));
  }
  returnObj.pop();
}

function Case1(
  wLemmaMap: number[],
  cLemmaMap: number[],
  wWords: string[],
  cWords: string[],
  cFinal: string[],
  wi: number,
  ci: number,
  returnObj: JSX.Element[]
): { wi2: number; ci2: number } {
  //wLemmaMap[wi] != ci
  //wLemmaMap[wi] < ci
  //Case 1: cLemmaMap[ci] = wi+k (k>0)
  let wi2 = wi;
  let ci2 = ci;
  let wSetMax = -1;
  let cSetMax = -1;
  while (wi2 < wWords.length && ci2 < cWords.length) {
    if (wLemmaMap[wi2] == -1) {
      wi2++;
      continue;
    }
    if (cLemmaMap[ci2] == -1) {
      ci2++;
      continue;
    }
    wSetMax = Math.max(wSetMax, wLemmaMap[wi2]);
    cSetMax = Math.max(cSetMax, cLemmaMap[ci2]);
    if (wSetMax <= ci2 && cSetMax <= wi2) {
      console.log("Case 1");
      CaseSolver(
        wi,
        wi2,
        ci,
        ci2,
        returnObj,
        wWords,
        cFinal,
        wLemmaMap,
        cLemmaMap
      );
      return { wi2, ci2 };
    } else {
      wi2++;
      ci2++;
    }
  }
  if (wi2 < wWords.length) {
    ci2--;
    while (wi2 < wWords.length) {
      if (wLemmaMap[wi2] == -1) {
        wi2++;
        continue;
      }
      wSetMax = Math.max(wSetMax, wLemmaMap[wi2]);
      if (wSetMax <= ci2 && cSetMax <= wi2) {
        console.log("Case 2");
        CaseSolver(
          wi,
          wi2,
          ci,
          ci2,
          returnObj,
          wWords,
          cFinal,
          wLemmaMap,
          cLemmaMap
        );
        return { wi2, ci2 };
      } else {
        wi2++;
      }
    }
  }
  if (ci2 < cWords.length) {
    wi2--;
    while (ci2 < cWords.length) {
      if (cLemmaMap[ci2] == -1) {
        ci2++;
        continue;
      }
      cSetMax = Math.max(cSetMax, cLemmaMap[ci2]);
      if (wSetMax <= ci2 && cSetMax <= wi2) {
        console.log("Case 3");
        CaseSolver(
          wi,
          wi2,
          ci,
          ci2,
          returnObj,
          wWords,
          cFinal,
          wLemmaMap,
          cLemmaMap
        );
        return { wi2, ci2 };
      } else {
        ci2++;
      }
    }
  }
  console.log("Case impossible");
  return { wi2: -1, ci2: -1 };
}

async function ProcessSentence(
  wOriginal: string,
  cOriginal: string
): Promise<JSX.Element[]> {
  const returnObj: JSX.Element[] = [];
  cOriginal.trim();
  wOriginal.trim();
  if (similarity(cOriginal, wOriginal) < 0.4) {
    return ReplaceFullSentence(wOriginal, cOriginal);
  }
  cOriginal = beautifyString(cOriginal);
  wOriginal = beautifyString(wOriginal);
  cOriginal = beautifyQuotes(cOriginal);
  const wPreprocessed: string = dePunctuate(wOriginal);
  const cPreprocessed: string = dePunctuate(cOriginal);

  const wLemmas: LemmaObj[] = await getLemmas(wPreprocessed);
  const cLemmas: LemmaObj[] = await getLemmas(cPreprocessed);
  const { wLemmaMap, cLemmaMap } = ProcessLemmas(wLemmas, cLemmas);
  let wrongWords = wPreprocessed.split(" ").filter((word) => word.length > 0);
  let correctWords = cPreprocessed.split(" ").filter((word) => word.length > 0);
  const finalCorrectWords = cOriginal
    .split(" ")
    .filter((word) => word.length > 0);

  console.log("Lemma map W: ", wLemmaMap);
  console.log("Lemma map C: ", cLemmaMap);
  console.log(wLemmas);
  console.log(cLemmas);
  console.log(wrongWords);
  console.log(correctWords);
  console.log("Original: " + wOriginal);
  console.log("Corrected: " + cOriginal);
  if (finalCorrectWords.length != correctWords.length) {
    console.log(finalCorrectWords);
    console.log(correctWords);
    return ReplaceFullSentence(wOriginal, cOriginal);
  }
  let wi = 0;
  let ci = 0;
  while (wi < wrongWords.length && ci < correctWords.length) {
    const w = wrongWords[wi];
    const c = correctWords[ci];
    const cFinal = finalCorrectWords[ci];
    let skip: boolean = false;
    if (wLemmaMap[wi] === -1) {
      if (wi == 0 && w.toLowerCase() === "then") {
        returnObj.push(Color("Then,", yellow));
        returnObj.push(Space());
      } else if (wi == 0 && w.toLowerCase() === "so") {
        returnObj.push(Color("So,", yellow));
        returnObj.push(Space());
      } else {
        returnObj.push(ColoredStrikethrough(w, red));
        returnObj.push(Space());
      }
      wi++;
      skip = true;
    }
    if (cLemmaMap[ci] === -1) {
      returnObj.push(Color(cFinal, green));
      returnObj.push(Space());
      ci++;
      skip = true;
    }

    if (skip) continue;
    else if (w === c) {
      returnObj.push(Default(cFinal));
    } else if (w.toLowerCase() === c.toLowerCase()) {
      returnObj.push(Default(cFinal));
    } else if (wLemmaMap[wi] === ci) {
      returnObj.push(ColoredStrikethrough(w, red));
      returnObj.push(Space());
      returnObj.push(Color(cFinal, green));
    } else if (cLemmaMap[ci] !== wi) {
      const { wi2, ci2 } = Case1(
        wLemmaMap,
        cLemmaMap,
        wrongWords,
        correctWords,
        finalCorrectWords,
        wi,
        ci,
        returnObj
      );
      if (wi2 == -1) {
        return ReplaceFullSentence(wOriginal, cOriginal);
      }
      wi = wi2;
      ci = ci2;
    }
    returnObj.push(Space());
    ci++;
    wi++;
  }
  while (wi < wrongWords.length) {
    const w = wrongWords[wi];
    returnObj.push(ColoredStrikethrough(w, red));
    returnObj.push(Space());
    wi++;
  }

  while (ci < correctWords.length) {
    const cFinal = finalCorrectWords[ci];
    returnObj.push(Color(cFinal, green));
    returnObj.push(Space());
    ci++;
  }
  console.log("Done!");
  return returnObj;
}

function MyCustomGrammarly(props: Props) {
  const [text, setText] = useState("");
  const [output, setOutput] = useState(<div></div>);
  return (
    <div
      style={{
        width: "100%",
        height: "700px",
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
          MainProcess(text, setOutput);
        }}
      >
        <h2 style={{ textAlign: "center" }}>Custom Grammarly</h2>
        <FormGroup
          sx={{
            padding: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "primary.main",
          }}
        >
          <TextField
            // maxRows={}
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

export default MyCustomGrammarly;

// //get similar sentence
// async function Middleware(
//   cSentencePrev: string,
//   wSentence: string
// ): Promise<{ obj: JSX.Element[]; correct: string }> {
//   const text =
//     cSentencePrev.length > 0 ? cSentencePrev + " " + wSentence : wSentence;

//   return await postData(
//     "http://demo.ella.school:13000/unity/nlp_tool/v1/grammarCorrection/basic",
//     {
//       text,
//     }
//   )
//     .then((data) => {
//       return data.json();
//     })
//     .then(async (data) => {
//       console.log("text: ", text);
//       console.log("corrected: ", data.correctedSentence);
//       const obj: JSX.Element[] = await Subprocess(
//         text,
//         data.correctedSentence,
//         cSentencePrev
//       );
//       const correct: string =
//         cSentencePrev.length > 0
//           ? GetCorrect(data.correctedSentence)
//           : data.correctedSentence;
//       return { obj, correct };
//     });
// }

// async function SubprocessOld(
//   wOriginal: string,
//   cOriginal: string,
//   callback: (a: JSX.Element) => void
// ) {
//   cOriginal.trim();
//   const returnObj: JSX.Element[] = [];
//   const wPreprocessed: string = preprocessString(wOriginal);
//   const cPreprocessed: string = preprocessString(cOriginal);
//   const wLemmas: LemmaObj[] = await getLemmas(wPreprocessed);
//   const cLemmas: LemmaObj[] = await getLemmas(cPreprocessed);
//   const { wLemmaMap, cLemmaMap } = ProcessLemmas(wLemmas, cLemmas);
//   let wrongWords = wPreprocessed.split(" ").filter((word) => word.length > 0);
//   let correctWords = cPreprocessed.split(" ").filter((word) => word.length > 0);
//   const finalCorrectWords = cOriginal
//     .split(" ")
//     .filter((word) => word.length > 0);
//   if (finalCorrectWords.length != correctWords.length) {
//     console.log(finalCorrectWords);
//     console.log(correctWords);
//     callback(Default("Implementation issue. Length are different"));
//     return;
//   }
//   console.log(wLemmaMap);
//   console.log(cLemmaMap);
//   console.log(wLemmas);
//   console.log(cLemmas);
//   console.log(wrongWords);
//   console.log(correctWords);
//   console.log("Original: " + wOriginal);
//   console.log("Corrected: " + cOriginal);
//   for (let i = 0; i < wPreprocessed.length; i++) {
//     if (wPreprocessed[i].charCodeAt(0) == 160) {
//       callback(
//         Color(
//           "Text contains invalid characters. It happens when you copy text from external sources.",
//           yellow
//         )
//       );
//       return;
//     }
//   }
//   let wi = 0;
//   let ci = 0;
//   while (wi < wrongWords.length && ci < correctWords.length) {
//     const w = wrongWords[wi];
//     const c = correctWords[ci];
//     const cFinal = finalCorrectWords[ci];
//     let skip: boolean = false;
//     if (wLemmaMap[wi] === -1) {
//       returnObj.push(ColoredStrikethrough(w, red));
//       returnObj.push(Space());
//       wi++;
//       skip = true;
//     }
//     if (cLemmaMap[ci] === -1) {
//       returnObj.push(Color(cFinal, green));
//       returnObj.push(Space());
//       ci++;
//       skip = true;
//     }

//     if (skip) continue;
//     else if (w === c) {
//       returnObj.push(Default(cFinal));
//     } else if (w.toLowerCase() === c.toLowerCase()) {
//       returnObj.push(Default(cFinal));
//     } else if (wLemmaMap[wi] === ci) {
//       returnObj.push(ColoredStrikethrough(w, red));
//       returnObj.push(Space());
//       returnObj.push(Color(cFinal, green));
//     } else if (cLemmaMap[ci] !== wi) {
//       const { wi2, ci2 } = Case1(
//         wLemmaMap,
//         cLemmaMap,
//         wLemmas,
//         cLemmas,
//         wrongWords,
//         correctWords,
//         finalCorrectWords,
//         wi,
//         ci,
//         returnObj
//       );
//       wi = wi2;
//       ci = ci2;
//     }
//     returnObj.push(Space());
//     ci++;
//     wi++;
//   }
//   console.log("Done!");
//   callback(<div>{returnObj}</div>);
// }

// async function Subprocess(
//   wOriginal: string,
//   cOriginal: string,
//   extra: string
// ): Promise<JSX.Element[]> {
//   cOriginal.trim();
//   wOriginal.trim();
//   extra.trim();

//   let cOriginalNew = "";
//   let wOriginalNew = "";
//   for (
//     let i = extra.length;
//     i < Math.max(cOriginal.length, wOriginal.length);
//     i++
//   ) {
//     if (i < cOriginal.length) {
//       cOriginalNew += cOriginal[i];
//     }
//     if (i < wOriginal.length) {
//       wOriginalNew += wOriginal[i];
//     }
//   }

//   const returnObj: JSX.Element[] = [];
//   cOriginal = cOriginalNew;
//   wOriginal = wOriginalNew;
//   cOriginal.trim();
//   wOriginal.trim();
//   return ProcessSentence(wOriginal, cOriginal);
// }
