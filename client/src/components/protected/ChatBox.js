import React from "react";

import { Paper, Button, List, ListItem, Input, Typography, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import styleChatBox from "./styleChatBox.js";

class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: '1',
      word: '',
      chatHistory: []
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  increment = (e) => {
    if (this.state.num >= 9) return;
    this.setState({ num: parseInt(this.state.num) + 1 });
  }

  decrement = (e) => {
    if (this.state.num === 0) return;
    this.setState({ num: parseInt(this.state.num) - 1 });
  }

  sendCurrentMsg = () => {
    const { num, word } = this.state
    if (num === '' || word === '' || !this.props.isMyTurn() || !this.props.isSpyTurn()) {
      return
    }
    this.props.submitHint({ num, word })

    this.setState({ num: '1', word: '' })
  }

  render() {
    const { num, word } = this.state
    const text = this.props.chatHistory.map((msg, index) => {
      return (
        <ListItem key={`msg-${index}`}>
          <Typography>{msg.player}:</Typography>
          <Typography>
            {msg.text}
          </Typography>
        </ListItem>);
    });
    const { classes } = this.props;
    return (
      <Paper className={classes.chatBox}>
        <List className={classes.chatList}>
          {text}
        </List>
        <Grid container item className={classes.inputStyle}>
          <Input className={classes.inputBox} name="word" value={word} onChange={this.handleChange} />
          <Typography variant="h5">
            <Button disabled={this.state.num <= 1 ? true : false} className={"MuiPaper-elevation1 "} onClick={this.decrement}>-</Button>
            {num}
            <Button disabled={this.state.num >= 9 ? true : false} className={"MuiPaper-elevation1"} onClick={this.increment}>+</Button>
          </Typography>
        </Grid>
        <Button onClick={() => this.sendCurrentMsg()} color='primary' variant='contained'>
          Submit Hint
          </Button>
      </Paper>


    );
  }
}

export default withStyles(styleChatBox)(ChatBox)
