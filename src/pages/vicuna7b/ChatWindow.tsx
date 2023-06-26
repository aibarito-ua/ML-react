import React from "react";
import "./components/styles.css";
import ChatWindowJS from "./components/ChatWindow";
export default function ChatWindow() {
  return (
    <div>
      <div style={{
        width: "100%",
        justifyContent:"center",
        alignItems:"center",
        display:"flex",
        margin: 0
      }}>
        <h2>Chat Window</h2>
      </div>
      <ChatWindowJS/>
    </div>
  );
}
