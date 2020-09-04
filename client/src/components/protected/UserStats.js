import React, { Component } from "react";
import { Paper, Input } from '@material-ui/core';
import StatTable from './StatTable'
import auth from '../auth/auth'

class UserStats extends Component {
	constructor(props) {
		super(props)
		this.state = {
			users: []
		}
		this.addData = this.addData.bind(this);
		this.removeData = this.removeData.bind(this);
	}
	
	async addData(username) {
		let newUsersList = this.removeData(username, false);
		if (!newUsersList) newUsersList = this.state.users;
		console.log("Getting user info "+username)
		const userListRes = await fetch('/statistics/byuser?username='+username, {
		      method: "GET",
		      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*","Cache-Control": "no-store" },
		      body: null
	    })
		console.log("User List Response "+userListRes)
	    const userRes = await userListRes.json();
		console.log("User Response "+userRes)
		const user = userRes.data;
		console.log(user);
		const newUsers = newUsersList.concat(user)
		this.setState({ users: newUsers })
	}
	
	async componentDidMount () {
		await this.addData(this.props.username);
	}
	
	removeData(username, refresh = true) {
		const newUsersList = this.state.users.filter((element)=>{
			console.log(username, element.username)
			if (element.username != username) return true;
			return false;
		})
		console.log("Length is "+newUsersList.length)
		if (this.state.users.length===newUsersList.length) return undefined;
		if (refresh) this.setState({ users: newUsersList })
		return newUsersList;
	}
	
	enterID = (e) => {
		if(e.key === 'Enter'){
			const username = e.target.value;
			this.addData(username);
		}
		
	}
	
	render() {		
		console.log(this.state.users);
		return (
			<Paper>
				<Input onKeyPress={this.enterID}></Input>
				<StatTable removeFunc={this.removeData} statistics={this.state.users} ></StatTable>
			</Paper>
		);
	}
}

export default UserStats