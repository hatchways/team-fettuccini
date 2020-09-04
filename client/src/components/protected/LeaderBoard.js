import React, { Component } from "react";
import { Button, Table, TableHead, TableRow, TableCell, TableBody, Paper, Input } from '@material-ui/core';
import fetchUtil from './fetchUtil'
import auth from '../auth/auth'


class LeaderBoard extends Component {
	constructor(props) {
		super(props);
		this.state = {
				sortBy : "numWins",
				order : "desc",
				page : 1
		}
		
		this.userList = [];
		this.standings = [];
		this.getData = this.getData.bind(this);
	}
	
	 async getData(sortBy = this.state.sortBy, page = this.state.page, order = this.state.order) {
		
		/*const userListRes = await fetch('/statistics/byuser?userId='+auth.getUserInfo().id, {
		      method: "GET",
		      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*","Cache-Control": "no-store" },
		      body: null
	    })
	    this.userList = await userListRes.json();
		this.userList = userList.data;*/
		
		const standingsRes = await fetch('/statistics/standings?sortBy='+sortBy+'&page='+page+'&order='+order, {
		      method: "GET",
		      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*", "Cache-Control": "no-store" },
		      body: null
	    })
		const newStandingsRes = await standingsRes.json();
		const newStandings = newStandingsRes.data;
		if ( !newStandings || newStandings.length==0) return;
		this.standings = newStandings;
		this.setState({ sortBy: sortBy, page: page, order: order });
	}
	
	
	
	async componentDidMount () {
		await this.getData();
	}
	
	newSortCriteria = (sortBy) => {
		console.log("new sort "+sortBy);
		console.log(sortBy);
		this.getData(sortBy, this.state.page);
	}
	
	pageChange = (page) => {
		console.log("page"+page);
		console.log(page);
		this.getData(this.state.sortBy, page);
	}
	
	nextPage = (page) => {
		this.getData( this.state.sortBy, this.state.page+1 );
	}
	
	previousPage = (page) => {
		if (this.state.page == 0) return;
		this.getData( this.state.sortBy, this.state.page-1);
	}
	
	enterPage = (e) => {
		if(e.key === 'Enter'){
			const page = e.target.value;
			if (page<0) return;
			this.getData( this.state.sortBy, page );
		}
		
	}
	
	order = (e) => {
		if (this.state.order == "asc") {
			console.log("Getting descending values")
			this.getData( this.state.sortBy, 1, "desc" );
		} else {
			console.log("Getting ascending values")
			this.getData( this.state.sortBy, 1, "asc" );
		}
	}
	
	render() {
		console.log("In render");
		const tableHeaders = [
				{ label: "Wins", sortBy: "numWins" }, 
				{ label: "Losses", sortBy: "numLosses" },
				{ label: "Win Rate", sortBy: "winPercent" },
				{ label: "Correct Guesses", sortBy: "correctHits" },
				{ label: "Opposing Agent Hit", sortBy: "opponentsHits" },
				{ label: "Civilians Hit", sortBy: "civiliansHits" },
				{ label: "Assassins Hit", sortBy: "assassinsHits" },
				{ label: "Correct Assists", sortBy: "correctAssists" },
				{ label: "Opposing Agents Assists", sortBy: "opponentsAssists" },
				{ label: "Civilians Assists", sortBy: "civiliansAssists" },
				{ label: "Assassins Assists", sortBy: "assassinsAssists" },
				{ label: "Correct Guess Rate", sortBy: "correctGuessPercent" },
				{ label: "Correct Assist Rate", sortBy: "correctAssistsPercent" },
				{ label: "Assists Per Hint", sortBy: "correctGuessesPerHint" },
				{ label: "Number of Hints Given", sortBy: "numHints" }
			];
		return (
				<Paper>
					<span key="utilities">
						<Button key="Previous" variant="contained" color="primary" onClick={ this.previousPage.bind(null, this.state.page-1) }>Previous</Button>
						<Button key="Next" variant="contained" color="primary" onClick={ this.nextPage.bind(null, this.state.page+1) }>Next</Button>
						<Input key="page" onKeyPress={this.enterPage}></Input>
						<Button key="switch" variant="contained" color="primary" onClick={ this.order }>Switch Order</Button>
					</span>
					<Table key="standingsTable" size="small">
						<TableHead key="headline">
							<TableRow key="headlineRow">
								{
									tableHeaders.map(( header )=>{
										return (<TableCell key={header.label+"_head"} align="center"><Button key={header+"_button"} sortBy={header.sortBy} onClick={this.newSortCriteria.bind(null, header.sortBy)}>{header.label}</Button></TableCell>);
									})
								}
							</TableRow>
						</TableHead>
						<TableBody key="standingsBody">
							{
								this.standings.map((stats) => {
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
												rowData.map((cellData, index)=> {
													return (<TableCell key={stats._id+"_"+tableHeaders[index].label} align="center">{cellData}</TableCell>);
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