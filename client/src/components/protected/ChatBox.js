import React, { useState, useCallback, useEffect } from "react";

import { Paper, InputBase, Button, List, ListItem, Input, Typography, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import styleChatBox from "./styleChatBox.js";

const spyDictionary = {
  RS: "red",
  RF: "redfield",
  BS: "blue",
  BF: "bluefield",
}

function ChatBox(props) {
  
  const [ num, setNum ] = useState(1);
  const [ word, setWord ] = useState("");

  const handleChange = (e) => {
    setWord(e.target.value);
  }

  const increment = (e) => {
    if (num >= 9) return;
    setNum(num + 1);
  }

  const decrement = (e) => {
    if (num === 0) return;
    setNum(num - 1);
  }

  const sendCurrentMsg = (e) => {
    e.preventDefault()
    if (num === '' || word === '') {
      return
    }

    props.submitHint({ num, word })

    setNum(1);
    setWord("");
  }
  
  const { classes } = props;
  const text = props.chatHistory.map((msg, index) => (
   <ListItem className={`${classes.listItem} ${classes['listItem' + spyDictionary[msg.role]]}`} key={`msg-${index}`}>
	 <Typography variant="subtitle2">{msg.name} ({msg.role}):</Typography>
	 <Typography variant="subtitle1">
	   {msg.text}
	 </Typography>
    </ListItem>));
	
	return (
	  <Paper className={classes.chatBox}>
	    <List className={classes.chatList}>
	      {text}
	    </List>
	    <form onSubmit={(e)=>sendCurrentMsg(e)} className={classes.chatForm}>
	      <div className={classes.inputStyle}>
	        <InputBase
	          className={classes.inputBox}
	          name="word"
	          value={word}
	          onChange={(e)=>handleChange(e)}
	          inputProps={{ 'aria-label': 'naked' }}
	          placeholder="Type here..." />
	
	        <div className={classes.inlineGrid} >
	          <Button
	            disabled={num <= 1 ? true : false}
	            className={`${classes.plusMinus} MuiPaper-elevation1`}
	            onClick={(e)=>decrement(e)}>-</Button>
	          <Typography className={classes.numInput} variant="h5">
	            {num}
	          </Typography>
	          <Button
	            disabled={num >= 9 ? true : false}
	            className={`${classes.plusMinus} MuiPaper-elevation1`}
	            onClick={(e)=>increment(e)}>+</Button>
	        </div>
	      </div>
	      <Button onClick={(e)=>sendCurrentMsg(e)} type='submit' color='primary' variant='contained'>
	        Done
	      </Button>
	    </form>
	  </Paper>	
	);
}

export default withStyles(styleChatBox)(ChatBox)
