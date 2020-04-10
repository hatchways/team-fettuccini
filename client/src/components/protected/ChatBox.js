import React from "react";

import { Paper, Button, List, ListItem, Input, } from "@material-ui/core";

export default class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: '',
      word: '',
      messages: []
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  sendCurrentMsg = () => {
    const { num, word, messages } = this.state
    if (num === '' || word === '') {
      return
    }
    this.props.submitHint({ num, word })
    const newMessage = `${num} - ${word}`

    this.setState({ num: '', word: '', messages: [...messages, newMessage] })
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
        <Input name="num" value={num} onChange={this.handleChange} style={{ width: 20, appearance: "textfield" }} />

        Hint
        <Input name="word" value={word} onChange={this.handleChange} />
        <Button onClick={() => this.sendCurrentMsg()} style={{ height: 30 }} color='primary' variant='contained'>
          Submit Hint
        </Button>
      </Paper>
    );
  }
}
