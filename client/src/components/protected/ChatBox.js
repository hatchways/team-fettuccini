import React from "react";

import { Paper, Button, List, ListItem, Input, } from "@material-ui/core";

export default class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: '',
      word: '',
      messages: [
        "First",
        "Second",
        "Third"
      ]
    }
    this.currentMsg = "hi";
    this.numWords = 1;
    this.matchID = this.props.matchID;
    this.userID = this.props.userID;
    this.position = this.props.position;
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  setCurrentMsg(msg) {
    this.currentMsg = msg;
  }

  setNumWords(num) {
    this.numWords = num;
  }

  sendCurrentMsg() {
    const { num, word, messages } = this.state
    if (num === '' || word === '') {
      return
    }
    this.props.submitHint({ num, word })
    const newMessage = `${num} - ${word}`

    this.setState({ num: '', word: '', messages: [messages, newMessage] })


    // const move = num + " " + word
    // if (this.currentMsg == "") return;
    // const word = this.currentMsg;
    // const numWords = this.numWords;
    // this.messages.push(this.currentMsg);
    // this.currentMsg = "";

    // var spyHintReq = new XMLHttpRequest();
    // spyHintReq.open('POST', '/matches/' + this.props.matchID + "/nextmove");
    // spyHintReq.setRequestHeader("Content-Type", "application/json");
    // spyHintReq.onreadystatechange = function () {
    //   if (spyHintReq.readyState === 4 && spyHintReq.status === 200) {
    //     var json = JSON.parse(spyHintReq.responseText);
    //     alert(json);
    //     console.log(json)
    //   }
    // };
    // var data = JSON.stringify({
    //   "userID": this.props.userID,
    //   "position": this.props.position,
    //   // "move": (this.numWords + " " + this.currentMsg)
    //   "move": (this.state.num + " " + this.state.word)
    // });
    // console.log('data', data)
    // spyHintReq.send(data);
    this.forceUpdate();
  }

  render() {
    const { num, word, messages } = this.state

    const text = messages.map((step, index) => {
      return (<ListItem key={`msg-${index}`}>{step}</ListItem>);
    });

    return (
      <Paper style={{ maxHeight: 300, overflow: 'auto' }}>
        <List>
          {text}
        </List>
        #
        <Input name="num" value={num} onChange={this.handleChange} style={{ width: 20, appearance: "textfield" }}>
        </Input>

        Hint
        <Input name="word" value={word} onChange={this.handleChange}>
        </Input>
        {/* <Input onChange={event => this.setCurrentMsg(event.target.value)}>
        </Input> */}
        <Button onClick={() => this.sendCurrentMsg()} style={{ height: 30 }} color='primary' variant='contained'>
          Submit Hint
        </Button>
      </Paper>
    );
  }
}
