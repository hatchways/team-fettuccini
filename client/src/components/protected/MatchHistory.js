import React, { Component } from "react";
import MappedWords from './MappedWords'
import { Typography, Paper, Button, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import styleMatch from "./styleMatch";
import matchDictionary from './matchDictionary'

class MatchHistory extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
				...this.state,
				matchID: this.props.matchID,
				positionState: 'Red Spy',
				guessesLeft: this.guessesLeft,
				words: this.props.location.state.words,
				factions: this.props.location.state.factions,
				history: this.props.location.state.history
		}
		alert(JSON.stringify(this.props.location.state.words));
		this.clickWord = this.clickWord.bind(this);
	}
	
	clickWord = async (e) => {
		
	}
	
	render() {
		const {matchID, words, factions, positionState, guessesLeft} = this.state;
		const classes = this.props.classes;
		const guessText = "";
		return (
				<div className={`${classes.paper} ${classes.centerText}`}>
		        <Typography variant="h4">
		          {this.state.positionState}
		        </Typography>
		        <Typography variant="body1">{["RF", "BF"].includes(matchDictionary[positionState]) ? guessText : <>&nbsp;</>}</Typography>
		        <MappedWords classes={classes} words={words} factions={factions} clickWord={this.clickWord} spyView={true} />
		      </div>
				);
		
	}
}

export default withStyles(styleMatch)(MatchHistory)