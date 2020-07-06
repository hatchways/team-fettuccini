import React, { Component } from "react";
import { List, ListItem } from "@material-ui/core";

class MatchBox extends Component {
	  
	
	constructor(props) {
		super(props);
		this.redSpy = this.props.redSpy;
		this.redField = this.props.redField;
		this.blueSpy = this.props.blueSpy;
		this.blueField = this.props.blueField;
		this.won = this.props.won;
	}
	
	
	render() {
		const redText = {color: '#ff0000', fontWeight: 'bold', backgroundColor: "#ffebcd"}
		const blueText = {color: '#0000ff', fontWeight: 'bold', backgroundColor: "#ffebcd"}
		const winText = {fontWeight: 'bold', backgroundColor: "#ffebcd"}
		return (
				<List>
					<ListItem style={redText}> Red Spy: {this.redSpy}</ListItem>
					<ListItem style={redText}> Red Field: {this.redField}</ListItem>
					<ListItem style={blueText}> Blue Spy: {this.blueSpy}</ListItem>
					<ListItem style={blueText}> Blue Field: {this.blueField}</ListItem>
					<ListItem style={winText}> Winner: {this.won}</ListItem>
				</List>
				);
	}
	
}

export default MatchBox;