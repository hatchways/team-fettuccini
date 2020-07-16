import React, { Component } from "react";
import { GridList, GridListTile, Button, Grid } from '@material-ui/core';
import fetchUtil from './fetchUtil'
import auth from '../auth/auth'
import MatchBox from './MatchBox'

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
				matches: []
		}
		this.cardClick = this.cardClick.bind(this);
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
	
	cardClick = (words, factions, history) => {
		this.props.history.push({
		      pathname: `/profile/matchhistory`,
		      state: { words: words, factions: factions, history: history}
		    })
		this.setState({
			...this.state
		})
	}
	
	render() {
		const matchItems = []
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
			const el = <MatchBox cardClick={this.cardClick} words={match.words} factions={match.factions} history={match.history} won={match.winner} redSpy={rs} blueSpy={bs} redField={rf} blueField={bf}/>
			matchItems.push(el);
		}
	    return (
	    	<Grid container>
	    		<Grid item xs="6">{matchItems[0]}</Grid>
	    		<Grid item xs="6">{matchItems[1]}</Grid>
	    		<Grid item xs="6">{matchItems[2]}</Grid>
	    		<Grid item xs="6">{matchItems[3]}</Grid>
	    	</Grid>
	    );
	  }
}

export default Profile;