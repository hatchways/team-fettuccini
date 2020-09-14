import React, { Component } from "react";
import { GridList, GridListTile, Button, Grid } from '@material-ui/core';
import fetchUtil from './fetchUtil'
import auth from '../auth/auth'
import MatchBox from './MatchBox'
import LeaderBoard from './LeaderBoard'
import UserStats from './UserStats'

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
				matches: []
		}
		this.match = this.match.bind(this);
		this.goBack = this.goBack.bind(this);
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
	
	match = (words, factions, history) => {
		this.props.history.push({
		      pathname: `/profile/matchhistory`,
		      state: { words: words, factions: factions, history: history}
		    })
		this.setState({
			...this.state
		})
	}
	
	goBack = (e) => {
		this.props.history.goBack();
	}
	
	render() {
		const matchItems = this.state.matches.map(
			(match, index) => {
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
				return <MatchBox 
						date={match.date} 
						match={this.match} 
						words={match.words} 
						factions={match.factions} 
						history={match.history} 
						won={match.winner} 
						redSpy={rs} 
						blueSpy={bs} 
						redField={rf} 
						blueField={bf}/>
			} 
		)

	    return (
	    	<div>
	    	  <Button variant="contained" color="primary" onClick={this.goBack}>Back</Button>
		      <Grid container>
		    	{matchItems.map(n => {
		          return (
		            <Grid item xs="3">
		              {n}
		            </Grid>
		          );
		        })}
		      </Grid>
		      <UserStats username={auth.getUserInfo().name}>
		    	
		      </UserStats>
		      <LeaderBoard>
		    		
		      </LeaderBoard>
	    	</div>
	    	
	    );
	  }
}

export default Profile;