import React from "react";
import "./components/styles.css";
import ChatPdf from "./components/ChatPdf";

export default function Vicuna7BPDF() {
  return (
    <div>
      <div style={{
        width: "100%",
        justifyContent:"center",
        alignItems:"center",
        display:"flex",
        margin: 0
      }}>
        <h2>{process.env.REACT_APP_VICUNA_NAME} Pdf</h2>
      </div>
      <ChatPdf />
    </div>
  );
}
