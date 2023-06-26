import React from "react";
import "./components/styles.css";
import OpenAIPdf from "./components/OpenAIPdf";

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
        <h2>OpenAI Pdf</h2>
      </div>
      <OpenAIPdf />
    </div>
  );
}
