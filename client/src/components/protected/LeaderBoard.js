import React, { useState, useRef, useEffect } from "react";
import { Button, Table, TableHead, TableRow, TableCell, TableBody, Paper, Input, TableSortLabel, Label } from '@material-ui/core';
import StatTable from "./StatTable";

function LeaderBoard(props) {
		
	const [state, setState] = useState({
		sortBy : "numWins",
		order : "desc",
		page : 1,
		startIndex : 1
	});
	
	const stateRef = useRef(state);
	const standings = useRef([]);
	
	const getData = (sortBy = stateRef.current.sortBy, page = stateRef.current.page, order = stateRef.current.order) => {
		console.log("Getting page "+page);		
		const standingsRes = fetch('/statistics/standings?sortBy='+sortBy+'&page='+page+'&order='+order, {
		      method: "GET",
		      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*", "Cache-Control": "no-store" },
		      body: null
	    })
	    .then((standingsRes)=>{
	    	return standingsRes.json();
	    })
	    .then((newStandingsRes)=>{
	    	if (newStandingsRes.message === "None") return;
			const newStandings = newStandingsRes.data;
			const startIndex = newStandingsRes.start;
			if ( !newStandings || newStandings.length==0) return;
			standings.current = newStandings;
			setState({ sortBy: sortBy, page: page, startIndex: startIndex, order: order });
	    })
		
	}
	
	useEffect(()=>{getData();}, []);
	
	useEffect(()=>{stateRef.current = state}, [state]);
	
	const newSortCriteria = (sortBy) => {
		console.log("new sort "+sortBy);
		console.log(sortBy);
		getData(sortBy, stateRef.current.page);
	}
	
	const pageChange = (page) => {
		console.log("page"+page);
		console.log(page);
		getData(stateRef.current.sortBy, page);
	}
	
	const nextPage = () => {
		getData( stateRef.current.sortBy, parseInt(stateRef.current.page)+1 );
	}
	
	const previousPage = () => {
		if (stateRef.current.page == 0) return;
		getData( stateRef.current.sortBy, parseInt(stateRef.current.page)-1);
	}
	
	const enterPage = (e) => {
		if(e.key === 'Enter'){
			const page = e.target.value;
			if (page<0) return;
			getData( stateRef.current.sortBy, page );
		}
	}
	
	const order = (e) => {
		if (stateRef.current.order == "asc") {
			console.log("Getting descending values")
			getData( stateRef.current.sortBy, 1, "desc" );
		} else {
			console.log("Getting ascending values")
			getData( stateRef.current.sortBy, 1, "asc" );
		}
	}
	
	console.log("In render");
	return (
			<Paper>
				<span key="utilities">
					<Button key="Previous" variant="contained" color="primary" onClick={ ()=>previousPage() }>Previous</Button>
					<Button key="Next" variant="contained" color="primary" onClick={ ()=>nextPage() }>Next</Button>
					<Input key="page" onKeyPress={enterPage}></Input>
					<Button key="switch" variant="contained" color="primary" onClick={ order }>Switch Order</Button>
				</span>
				<StatTable statistics={standings.current} sortCriteria={newSortCriteria} rank={true} page={state.page} startIndex={state.startIndex} ></StatTable>
			</Paper>
	);
}


export default LeaderBoard;