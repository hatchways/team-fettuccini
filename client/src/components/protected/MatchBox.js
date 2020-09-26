import React, { useState } from "react";
import { List, ListItem, Card, CardContent, Typography } from "@material-ui/core";
import { createGenerateClassName } from "@material-ui/core/styles";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

function MatchBox(props) {
	  
	
	const redSpy = props.redSpy;
	const redField = props.redField;
	const blueSpy = props.blueSpy;
	const blueField = props.blueField;
	const won = props.won;
	const date = props.date;
	const match = props.match;
	const words = props.words;
	const factions = props.factions;
	const history = props.history;
	
	const redText1 = {color: '#ff0000', fontWeight: 'bold', backgroundColor: "#ffebcd", position: "relative", textAlign: "center"}
	const redText2 = {color: '#ff0000', fontWeight: 'bold', backgroundColor: "#ffebcd", position: "relative", textAlign: "center"}
	const blueText1 = {color: '#0000ff', fontWeight: 'bold', backgroundColor: "#ffebcd", position: "relative", textAlign: "center"}
	const blueText2 = {color: '#0000ff', fontWeight: 'bold', backgroundColor: "#ffebcd", position: "relative", textAlign: "center"}
	const winText = {fontWeight: 'bold', backgroundColor: "#ffebcd", textAlign: "center"}
	
	return (
			<Card align="top" justify="left" onClick={() => {match(words, factions, history)}}>
				<CardContent style={redText1}><Typography  variant="h5"> Red Spy: {redSpy}</Typography></CardContent>
				<CardContent style={redText2}><Typography  variant="h5"> Red Field: {redField}</Typography></CardContent>
				<CardContent style={blueText1}><Typography  variant="h5"> Blue Spy: {blueSpy}</Typography></CardContent>
				<CardContent style={blueText2}><Typography  variant="h5"> Blue Field: {blueField}</Typography></CardContent>
				<CardContent style={winText}><Typography  variant="h5"> Winner: {won}</Typography></CardContent>
				<CardContent style={winText}><Typography  variant="h5"> Date: {date.substr(0, date.indexOf('T'))}</Typography></CardContent>
				<CardContent style={winText}><Typography  variant="h5"> Time: {date.substr(date.indexOf('T')+1, date.indexOf('T')+2)}</Typography></CardContent>
			</Card>
			);
	
}

export default MatchBox;