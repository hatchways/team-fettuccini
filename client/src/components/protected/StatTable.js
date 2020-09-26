import { Button, Table, TableHead, TableRow, TableCell, TableBody, Paper, Input, TableSortLabel, Label } from '@material-ui/core';
import React, { Component } from "react";
import RemoveIcon from '@material-ui/icons/Remove';

function StatTable(props) {
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
	  <Table key="standingsTable" size="small">
	    <TableHead key="headline">
		  <TableRow key="headlineRow">
		    <TableCell align="center">{props.rank ? "Rank" : ""}</TableCell>
			<TableCell align="center">Name</TableCell>
			  {
			    tableHeaders.map(( header )=>{
			    	return props.rank ? (<TableCell key={header.label+"_head"} align="center"><TableSortLabel key={header+"_button"} sortBy={header.sortBy} onClick={props.sortCriteria.bind(null, header.sortBy)}>{header.label}</TableSortLabel></TableCell>) : (<TableCell key={header.label+"_head"} align="center">{header.label}</TableCell>)
			    })
			  }
		  </TableRow>
		</TableHead>
		<TableBody key="standingsBody">
		  {
			props.statistics.map((stats, index) => {
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
			  console.log(stats)
			  return (
			    <TableRow key={ stats._id }>
			    <TableCell>{ props.rank ? (parseInt(props.startIndex)+index)+". " : <RemoveIcon onClick={props.removeFunc.bind(null, stats.username)} style={{}}/>}</TableCell>
				<TableCell>{stats.username}</TableCell>
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
	);
}

export default StatTable;