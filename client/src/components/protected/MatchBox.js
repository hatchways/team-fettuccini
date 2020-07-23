import React, { Component } from "react";
import { List, ListItem, Card, CardContent, Typography } from "@material-ui/core";
import { createGenerateClassName } from "@material-ui/core/styles";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

class MatchBox extends Component {
	  
	
	constructor(props) {
		super(props);
		this.redSpy = this.props.redSpy;
		this.redField = this.props.redField;
		this.blueSpy = this.props.blueSpy;
		this.blueField = this.props.blueField;
		this.won = this.props.won;
		this.date = this.props.date;
		this.cardClick = this.props.cardClick;
		this.words = this.props.words;
		this.factions = this.props.factions;
		this.history = this.props.history;
	}
	
	render() {
		const redText1 = {color: '#ff0000', fontWeight: 'bold', backgroundColor: "#ffebcd", position: "relative", textAlign: "center"}
		const redText2 = {color: '#ff0000', fontWeight: 'bold', backgroundColor: "#ffebcd", position: "relative", textAlign: "center"}
		const blueText1 = {color: '#0000ff', fontWeight: 'bold', backgroundColor: "#ffebcd", position: "relative", textAlign: "center"}
		const blueText2 = {color: '#0000ff', fontWeight: 'bold', backgroundColor: "#ffebcd", position: "relative", textAlign: "center"}
		const winText = {fontWeight: 'bold', backgroundColor: "#ffebcd", textAlign: "center"}
		//let cardStyle = {backgroundColor: 'RED', width: {width}, height: {height}, top: {t}, left: {l}, position: 'absolute'}
		//if (this.won == "Blue") cardStyle = {backgroundColor: 'BLUE'}
		
		return (
				<Card align="top" justify="left" onClick={() => {this.cardClick(this.words, this.factions, this.history)}}>
					<CardContent style={redText1}><Typography  variant="h5"> Red Spy: {this.redSpy}</Typography></CardContent>
					<CardContent style={redText2}><Typography  variant="h5"> Red Field: {this.redField}</Typography></CardContent>
					<CardContent style={blueText1}><Typography  variant="h5"> Blue Spy: {this.blueSpy}</Typography></CardContent>
					<CardContent style={blueText2}><Typography  variant="h5"> Blue Field: {this.blueField}</Typography></CardContent>
					<CardContent style={winText}><Typography  variant="h5"> Winner: {this.won}</Typography></CardContent>
					<CardContent style={winText}><Typography  variant="h5"> Date: {this.date.substr(0, this.date.indexOf('T'))}</Typography></CardContent>
					<CardContent style={winText}><Typography  variant="h5"> Time: {this.date.substr(this.date.indexOf('T')+1, this.date.indexOf('T')+2)}</Typography></CardContent>
				</Card>
				);
	}
	
}

export default MatchBox;