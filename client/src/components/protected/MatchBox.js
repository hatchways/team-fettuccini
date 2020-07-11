import React, { Component } from "react";
import { List, ListItem, Card, CardContent } from "@material-ui/core";
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
		
		this.cardClick = this.cardClick.bind(this);
	}
	
	
	cardClick = () => {
		alert("here");
	}
	
	render() {
		const redText1 = {color: '#ff0000', fontWeight: 'bold', backgroundColor: "#ffebcd", position: "relative"}
		const redText2 = {color: '#ff0000', fontWeight: 'bold', backgroundColor: "#ffebcd", position: "relative"}
		const blueText1 = {color: '#0000ff', fontWeight: 'bold', backgroundColor: "#ffebcd", position: "relative"}
		const blueText2 = {color: '#0000ff', fontWeight: 'bold', backgroundColor: "#ffebcd", position: "relative"}
		const winText = {fontWeight: 'bold', backgroundColor: "#ffebcd"}
		//let cardStyle = {backgroundColor: 'RED', width: {width}, height: {height}, top: {t}, left: {l}, position: 'absolute'}
		//if (this.won == "Blue") cardStyle = {backgroundColor: 'BLUE'}
		
		return (
				<Card align="top" justify="left" onClick={this.cardClick}>
					<CardContent style={redText1}> Red Spy: {this.redSpy}</CardContent>
					<CardContent style={redText2}> Red Field: {this.redField}</CardContent>
					<CardContent style={blueText1}> Blue Spy: {this.blueSpy}</CardContent>
					<CardContent style={blueText2}> Blue Field: {this.blueField}</CardContent>
					<CardContent style={winText}> Winner: {this.won}</CardContent>
				</Card>
				);
	}
	
}

export default MatchBox;