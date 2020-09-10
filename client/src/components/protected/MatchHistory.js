import React, { Component } from "react";
import MappedWords from './MappedWords'
import { Typography, Paper, Button, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import styleMatch from "./styleMatch";
import matchDictionary from './matchDictionary'

class MatchHistory extends Component {
	constructor(props) {
		super(props);
		this.history = this.props.location.state.history;
		this.factions = this.props.location.state.factions;
		this.initWords = JSON.parse(this.history[0]).words;
		this.state = {
				...this.state,
				histIndex: 0
		}
		this.clickWord = this.clickWord.bind(this);
		this.onForward = this.onForward.bind(this);
		this.onBack = this.onBack.bind(this);
		this.goBack = this.goBack.bind(this);
	}
	
	clickWord = async (e) => {
		
	}
	
	onBack = (e) => {
		if (this.state.histIndex == 0) return;
		const newIndex = this.state.histIndex - 1;
		const history = this.history[newIndex];
		this.setState({
			...this.state,
			histIndex: newIndex
		})
		
		
	}
	
	onForward = (e) => {
		if (this.state.histIndex == this.history.length - 1) return;
		const newIndex = this.state.histIndex + 1;
		const history = this.history[newIndex];
		this.setState({
			...this.state,
			histIndex: newIndex
		})
	} 
	
	goBack = (e) => {
		this.props.history.goBack();
	}
	
	render() {
		const {histIndex} = this.state;
		const history = JSON.parse(this.history[histIndex]);
		const factions = this.factions;
		const classes = this.props.classes;
		const positionState = history.turn;
		const guessText = "Guesses left: "+history.numGuessesLeft;
		const words = history.words;
		const spyHint = history.spyHint;
		const redLeft = history.redLeft;
		const blueLeft = history.blueLeft;
		
		const newWords = [];
		for (var i = 0;i<words.length;i++) {
			const w = words[i];
			if (w.charAt(0)=='_') {
				newWords.push(w.substr(0,2)+this.initWords[i])
			} else {
				newWords.push(w);
			}
		}
		
		return (
				<div className={`${classes.paper} ${classes.centerText}`}>
					<Button variant="contained" color="primary" onClick={this.goBack}>Previous Page</Button>
					<Typography variant="h4">
			          {positionState}
			        </Typography>
			        <Typography variant="body1">{["RF", "BF"].includes(matchDictionary[positionState]) ? "Hint:\t"+spyHint+" "+guessText : <>&nbsp;</>}</Typography>
			        <MappedWords classes={classes} words={newWords} factions={factions} clickWord={this.clickWord} spyView={true} />
			        <span>
			        	<Button variant="contained" color="primary" onClick={this.onBack}>Back</Button>
			        	<Button variant="contained" color="primary" onClick={this.onForward}>Forward</Button>
			        </span>					
		        </div>
				);
		
	}
}

export default withStyles(styleMatch)(MatchHistory)