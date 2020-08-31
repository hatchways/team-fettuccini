import React, { Component } from "react";
import { Button, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@material-ui/core';
import fetchUtil from './fetchUtil'
import auth from '../auth/auth'


class LeaderBoard extends Component {
	constructor(props) {
		super(props);
		this.state = {
				userList : [],
				standings : [],
				sortBy : "numWins",
				order : "asc",
				page : 1
		}
	}
	
	async componentDidMount () {
		let finished = 0;
		let newStandings = [];
		let userList = [];
				
		const standingsRes = await fetch('/statistics/standings?sortBy='+this.state.sortBy+'&page='+this.state.page, {
		      method: "GET",
		      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*", "Cache-Control": "no-store" },
		      body: null
	    })
		newStandings = await standingsRes.json();
	    /*.then(res=>res.json())
	    .then(standings=>{
	    	newStandings=standings;
	    	console.log(newStandings);
	    	finished++;
	    })*/
	    
	    const userListRes = await fetch('/statistics/byuser?userId='+auth.getUserInfo().id, {
		      method: "GET",
		      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*","Cache-Control": "no-store" },
		      body: null
	    })
	    userList = await userListRes.json();
	    /*.then(res=>res.json())
	    .then(data => {
	    	userList = data;
	    	console.log(userList);
	    	finished++;
	    })*/
	    //console.log("component");
	    //while (finished<2) {}
		console.log(newStandings);
		this.setState({ userList: userList, standings: newStandings})
	}
	
	render() {
		const tableHeaders = ["Wins", "Losses", "Win Rate", "Correct Guesses", "Opposing Agent Hit", "Civilians Hit", "Assassins Hit",
				"Correct Assists", "Opposing Agents Assists", "Civilians Assists", "Assassins Assists", "Correct Guess Rate",
				"Correct Assist Rate", "Assists Per Hint", "Number of Hints Given"
			];
		return (
				<Paper>
					<Table size="small">
						<TableHead>
							<TableRow>
								{
									tableHeaders.map(( header )=>{
										return (<TableCell key={header+"head"} align="center">{header}</TableCell>);
									})
								}
							</TableRow>
						</TableHead>
						<TableBody>
							{
								this.state.standings.map((stats) => {
									const rowData = [
										stats.numWins, 
										stats.numLosses, 
										Number.parseFloat((stats.numWins)/(stats.numWins+stats.numLosses)).toFixed(2),
										stats.correctHits,
										stats.opponentsHits,
										stats.civiliansHits,
										stats.assassinsHits,
										stats.correctAssists,
										stats.opponentsAssists,
										stats.civiliansAssists,
										stats.assassinsAssists,
										Number.parseFloat(stats.correctHits/(stats.correctHits+stats.assassinsHits+stats.civiliansHits+stats.opponentsHits)).toFixed(2),
										Number.parseFloat(stats.correctAssists/(stats.correctAssists+stats.assassinsAssists+stats.civiliansAssists+stats.opponentsAssists)).toFixed(2),
										Number.parseFloat(stats.correctAssists/(stats.numHints)).toFixed(2),
										stats.numHints
									]
									return (
											<TableRow key={ stats._id }>
											{
												rowData.map((cellData)=> {
													return (<TableCell align="center">{cellData}</TableCell>);
												})
											}
										</TableRow>
									);
								})
							}
						</TableBody>
					</Table>
				</Paper>
		);
	}
}


export default LeaderBoard;