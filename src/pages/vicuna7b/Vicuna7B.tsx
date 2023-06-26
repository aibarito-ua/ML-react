import React from "react";
import "./components/styles.css";
import ChatPlain from "./components/ChatPlain";

export default function Vicuna7B() {
  return (
    <div className="App">
      <div style={{
        width: "100%",
        justifyContent:"center",
        alignItems:"center",
        display:"flex",
        margin: 0
      }}>
        <h2>{process.env.REACT_APP_VICUNA_NAME}</h2>
      </div>
      <ChatPlain />
    </div>
  );
}
