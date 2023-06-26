import React from "react";
import "./components/styles.css";
import ChatMemory from "./components/ChatMemory";

export default function Vicuna7BMemory() {
  return (
    <div className="App">
      <div style={{
        width: "100%",
        justifyContent:"center",
        alignItems:"center",
        display:"flex",
        margin: 0
      }}>
        <h2>{process.env.REACT_APP_VICUNA_NAME} Memory</h2>
      </div>
      <ChatMemory />
    </div>
  );
}
