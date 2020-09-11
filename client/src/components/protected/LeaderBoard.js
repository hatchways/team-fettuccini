import React, { Component } from "react";
import { Button, Table, TableHead, TableRow, TableCell, TableBody, Paper, Input, TableSortLabel, Label } from '@material-ui/core';
import StatTable from "./StatTable";

class LeaderBoard extends Component {
	constructor(props) {
		super(props);
		this.state = {
				sortBy : "numWins",
				order : "desc",
				page : 1,
				startIndex : 1
		}
		
		this.standings = [];
		this.getData = this.getData.bind(this);
	}
	
	 async getData(sortBy = this.state.sortBy, page = this.state.page, order = this.state.order) {
		console.log("Getting page "+page);		
		const standingsRes = await fetch('/statistics/standings?sortBy='+sortBy+'&page='+page+'&order='+order, {
		      method: "GET",
		      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*", "Cache-Control": "no-store" },
		      body: null
	    })
		const newStandingsRes = await standingsRes.json();
		if (newStandingsRes.message === "None") return;
		const newStandings = newStandingsRes.data;
		const startIndex = newStandingsRes.start;
		if ( !newStandings || newStandings.length==0) return;
		this.standings = newStandings;
		this.setState({ sortBy: sortBy, page: page, startIndex: startIndex, order: order });
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
		this.getData( this.state.sortBy, parseInt(this.state.page)+1 );
	}
	
	previousPage = (page) => {
		if (this.state.page == 0) return;
		this.getData( this.state.sortBy, parseInt(this.state.page)-1);
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
		console.log(this.standings);
		return (
				<Paper>
					<span key="utilities">
						<Button key="Previous" variant="contained" color="primary" onClick={ this.previousPage.bind(null, this.state.page-1) }>Previous</Button>
						<Button key="Next" variant="contained" color="primary" onClick={ this.nextPage.bind(null, this.state.page+1) }>Next</Button>
						<Input key="page" onKeyPress={this.enterPage}></Input>
						<Button key="switch" variant="contained" color="primary" onClick={ this.order }>Switch Order</Button>
					</span>
					<StatTable statistics={this.standings} sortCriteria={this.newSortCriteria} rank={true} page={this.state.page} startIndex={this.state.startIndex} ></StatTable>
				</Paper>
		);
	}
}


export default LeaderBoard;