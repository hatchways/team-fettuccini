import React, { useState, useEffect } from "react";
import { Button, Grid } from '@material-ui/core';
import fetchUtil from './fetchUtil'
import auth from '../auth/auth'
import MatchBox from './MatchBox'
import LeaderBoard from './LeaderBoard'
import UserStats from './UserStats'

function Profile(props) {
	
	const [ matches, setMatches ] = useState([]);
	
	useEffect(()=>{
		fetchUtil({
	        url: '/users/profile',
	        method: "GET",
	        body: {
	          userID: auth.getUserInfo().id
	        }
	    }).then((res) => {
	    	const matches = res.matchList;
			setMatches(matches);
	    })
	},[]);
	
	const matchFunc = (words, factions, history) => {
		props.history.push({
		      pathname: `/profile/matchhistory`,
		      state: { words: words, factions: factions, history: history}
		    })
		setMatches(matches)
	}
	
	const goBack = (e) => {
		props.history.goBack();
	}
	
	const matchItems = matches.map(
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
					match={matchFunc} 
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
    	  <Button variant="contained" color="primary" onClick={goBack}>Back</Button>
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

export default Profile;