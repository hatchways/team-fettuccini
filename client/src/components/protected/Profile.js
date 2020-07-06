import React, { Component } from "react";
import { GridList, GridListTile, Button } from '@material-ui/core';
import fetchUtil from './fetchUtil'
import auth from '../auth/auth'
import MatchBox from './MatchBox'

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
				matches: []
		}
	}
	
	componentDidMount = () => {
		fetchUtil({
	        url: '/users/profile',
	        method: "GET",
	        body: {
	          userID: auth.getUserInfo().id
	        }
	    }).then((res) => {
	    	const matches = res.matchList;
			this.setState({
				...this.state,
				matches: matches
			});
	    })
	    
	}
	
	render() {
		const matchItems = []
		const backColour = {backgroundColor: '#ffebcd'}
		for (var i = 0;i<this.state.matches.length;i++) {
			const match = this.state.matches[i];
			const parts = match.participants;
			let rs = "";
			let rf = "";
			let bs = "";
			let bf = "";
			for (var j = 0;j<parts.length;j++) {
				if (parts[j].role == "Red spy") {
					rs = parts[j].user;
				} else if (parts[j].role == "Red field") {
					rf = parts[j].user;
				} else if (parts[j].role == "Blue spy") {
					bs = parts[j].user;
				} else {
					bf = parts[j].user;
				}
			}
			const el = <MatchBox style={backColour} won={match.winner} redSpy={rs} blueSpy={bs} redField={rf} blueField={bf}/>
			matchItems.push(el);
		}
	    return (
	    	<GridList cols="2">
	    		{matchItems}
	    	</GridList>
	    );
	  }
}

export default Profile;