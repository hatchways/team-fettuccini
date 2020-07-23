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
					rs = parts[j].user.username;
				} else if (parts[j].role == "Red field") {
					rf = parts[j].user.username;
				} else if (parts[j].role == "Blue spy") {
					bs = parts[j].user.username;
				} else {
					bf = parts[j].user.username;
				}
			}
			const el = <MatchBox date={match.date} cardClick={this.cardClick} words={match.words} factions={match.factions} history={match.history} won={match.winner} redSpy={rs} blueSpy={bs} redField={rf} blueField={bf}/>
			matchItems.push(el);
		}
	    return (
	    	<Grid container>
	    	{matchItems.map(n => {
	            return (
	              <Grid item xs="3">
	                {n}
	              </Grid>
	            );
	          })}
	    	</Grid>
	    );
	  }
}

export default Profile;