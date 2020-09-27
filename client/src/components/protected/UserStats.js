import React, { useState, useEffect, useRef } from "react";
import { Paper, Input } from '@material-ui/core';
import StatTable from './StatTable'
import auth from '../auth/auth'

function UserStats(props) {
	
	const [ users, setUsers ] = useState([]);
	
	const addData = (username) => {
		let newUsersList = removeData(username, false);
		if (!newUsersList) newUsersList = users;
		console.log("Getting user info "+username)
		fetch('/statistics/byuser?username='+username, {
		      method: "GET",
		      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*","Cache-Control": "no-store" },
		      body: null
	    })
	    .then((res)=>{return res.json()})
	    .then((res)=>{
	    	const user = res.data;
	    	const newUsers = newUsersList.concat(user);
	    	setUsers(newUsers)
	    })
	}
	
	useEffect(()=>addData(props.username), []);
	
	//It is assumed that the list will not get so big that the linear runtime will become significant.
	//This is because this widget is for the user to compare small groups of players to each other.
	const removeData = (username, refresh = true) => {
		const newUsersList = users.filter((element)=>{
			if (element.username != username) return true;
			return false;
		})
		if (users.length===newUsersList.length) return undefined;
		if (refresh) setUsers(newUsersList);
		return newUsersList;
	}
	
	const enterID = (e) => {
		if(e.key === 'Enter'){
			const username = e.target.value;
			addData(username);
		}
		
	}
	
	return (
		<Paper>
			<Input onKeyPress={enterID}></Input>
			<StatTable removeFunc={removeData} statistics={users} ></StatTable>
		</Paper>
	);
}

export default UserStats