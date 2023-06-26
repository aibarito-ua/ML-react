import React from "react";
import { ChatFeed, Message } from "react-chat-ui";
import { Button, css, Divider, FormGroup, Stack, Switch, TextField, Typography } from "@mui/material";
const URL = process.env.REACT_APP_VICUNA_PLAIN;
async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response; // parses JSON response into native JavaScript objects
}
async function getData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
  return response; // parses JSON response into native JavaScript objects
}


async function MainProcess(
  text,
  selected,
  clearPrevious
) {
  return await getData("http://demo.ella.school:5011/json/read/vicuna/7b/memory").then(rsp=> rsp.json()).then(async data=>{
    return await postData(URL + "/memory", { text, selected,
      clear_previous: clearPrevious, prompt: data.prompt, temperature: data.temperature, top_p: data.top_p, 
      max_new_tokens: data.max_new_tokens, chat_prompt_size: data.chat_prompt_size, repetition_penalty: data.repetition_penalty, 
      top_k: data.top_k, ainame: data.ainame, username: data.username})
    .then((data) => {
      return data.json();
    }).then(async (data) => {
      return [data.output, data.prompt]
    }).catch((e)=>{
      return "Server is not running"
    });
  })
}

const users = {
  0: "You",
  1: "Ella"
};

const customBubble = props => (
  <div>
    <p>{`${props.message.senderName} ${props.message.id ? "says" : "said"}: ${
      props.message.message
    }`}</p>
  </div>
);

const readJson = async () => {
  return await getData("http://demo.ella.school:5011/json/read/vicuna/7b/chat/memory").then(rsp=> rsp.json()).then(data=>{
    const history = data.history
    const rsp = []
    history.forEach(obj => {
      const message = obj.message;
      const id = obj.id;
      rsp.push(new Message({message, id, senderName: users[id]}))
    })
    return [rsp, history]
  })
}

const saveJson = (json) =>{
  const history = []
  json.forEach(obj=>{
    const msg = obj.message;
    const id = obj.id
    history.push({message: msg, id})
  })
  postData("http://demo.ella.school:5011/json/write/vicuna/7b/chat/memory", 
  {history: history});
}


class ChatPlain extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      history: [],
      useCustomBubble: false,
      clearPrevious: false,
      curr_user: 0,
      selected: 0
    };
    
  }
  async componentDidMount() {  
    const [messages, history] = await readJson();
    this.setState({messages})
    this.setState({history})
   }

  onPress(user) {
    this.setState({ curr_user: user });
  }

  async onMessageSubmit(e) {
    const input = this.message;
    e.preventDefault();
    if (!input.value) {
      return false;
    }
    const text = input.value;
    this.pushUserMessage(this.state.curr_user, text);
    input.value = "";
    const selected = 0;
    const clearPrevious = this.state.history.length == 1
    const [reply, prompt] = await MainProcess(text, selected, clearPrevious);
    this.pushEllaMessage(reply, prompt)
    return true;
  }

  pushUserMessage(recipient, message) {
    const prevState = this.state;
    const newMessage = new Message({
      id: recipient,
      message,
      senderName: users[recipient]
    });
    prevState.history.push({message, id: recipient})
    prevState.messages.push(newMessage);
    this.setState(this.state);
  }

  pushEllaMessage( message, prompt) {
    const prevState = this.state;
    const newMessage = new Message({
      id: 1,
      message: <div style={{color:"black"}}> {message}</div>,
      senderName: "Ella"
    });
    prevState.messages.push(newMessage);
    prevState.history.push({message, id: 1});
    this.setState({...this.state, prompt});
    saveJson(this.state.history);
  }
  setSelected(x){
    this.setState({selected: x});
  }

  render() {
    return (
      <div style={{
        width: "100%",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        display: "flex",
        flexDirection: "row",
      }}>
        <div className="container">
          <div className="chatfeed-wrapper">
            <ChatFeed
              chatBubble={this.state.useCustomBubble && customBubble}
              maxHeight={500}
              messages={this.state.messages} // Boolean: list of message objects
              showSenderName
            />
            <form onSubmit={e => this.onMessageSubmit(e)}>
              <input
                style={{height: 50}}
                ref={m => {
                  this.message = m;
                }}
                placeholder="Type a message..."
                className="message-input"
              />
            </form>
          </div>
          <form  style={{
              direction: "rtl",
              width: "100%",
              padding: 10,
              marginTop: 20,
              fontSize: 15,
            }}
          onSubmit={(e)=>{
            e.preventDefault();
            this.setState({clearPrevious: true})
            this.setState({messages: []})
            this.setState({history: []})
            saveJson(this.state.history)
            }}>
            <Button type="submit" variant="outlined" >
              Clear History
            </Button>
          </form>
          <div>
              <h3>Prompt will look like this:</h3>
              <textarea
                fullWidth
                width={1000}
                  multiline={true}
                  readOnly={true}
                  rows={50}
                  style={{marginTop: 0, marginBottom: 50, width: "100%"}}
                  size="small"
                  color="primary"
                  type="text"
                  value={this.state.prompt}
                ></textarea>
          </div>
        </div>
       </div>
    );
  }
}

export default ChatPlain;
