import React, { useState, useRef } from "react";
import MappedWords from './MappedWords'
import { Typography, Paper, Button, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import styleMatch from "./styleMatch";
import matchDictionary from './matchDictionary'

function MatchHistory(props) {

	const historyRef = useRef(props.location.state.history);
	const factionsRef = useRef(props.location.state.factions);
	const [histIndex, setState] = useState(0);
	const initWords = JSON.parse(historyRef.current[0]).words;
	
	const clickWord = async (e) => {
		
	}
	
	const onBack = (e) => {
		if (histIndex == 0) return;
		const newIndex = histIndex - 1;
		setState(newIndex)
	
	}
	
	const onForward = (e) => {
		if (histIndex == history.length - 1) return;
		const newIndex = histIndex + 1;
		setState(newIndex)
	} 
	
	const goBack = (e) => {
		props.history.goBack();
	}
	
	const history = historyRef.current;
	const factions = factionsRef.current;

	const currState = JSON.parse(history[histIndex]);
	const classes = props.classes;
	const positionState = currState.turn;
	const guessText = "Guesses left: "+currState.numGuessesLeft;
	const words = currState.words;
	const spyHint = currState.spyHint;
	const newWords = words.map(
		(word, i) => {
			if (word.charAt(0)=='_') {
				return (word.substr(0,2)+initWords[i])
			} else {
				return word;
			}
		}
	);
	
	return (
			<div className={`${classes.paper} ${classes.centerText}`}>
				<Button variant="contained" color="primary" onClick={goBack}>Previous Page</Button>
				<Typography variant="h4">
		          {positionState}
		        </Typography>
		        <Typography variant="body1">{["RF", "BF"].includes(matchDictionary[positionState]) ? "Hint:\t"+spyHint+" "+guessText : <>&nbsp;</>}</Typography>
		        <MappedWords classes={classes} words={newWords} factions={factions} clickWord={clickWord} spyView={true} />
		        <span>
		        	<Button variant="contained" color="primary" onClick={onBack}>Back</Button>
		        	<Button variant="contained" color="primary" onClick={onForward}>Forward</Button>
		        </span>					
	        </div>
			);
}

export default withStyles(styleMatch)(MatchHistory)