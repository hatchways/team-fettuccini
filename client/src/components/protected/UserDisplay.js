import React from "react";

import { Paper, Button, List, ListItem, Input } from "@material-ui/core";

export default class UserDisplay extends React.Component {

  state = {
    RS: "",
    RF: "blah",
    BS: "by",
    BF: "asdf",
    thisUser: this.props.thisUser
  };

  setUser = async (player, pos) => {
    if (pos=="RS") {
      if (this.state.RS==this.state.thisUser) this.setState({RS: ""});
      else this.setState({RS: player});
    } else if (pos=="RF") {
      if (this.state.RF==this.state.thisUser) this.setState({RF: ""});
      else this.setState({RF: player});
    } else if (pos=="BS") {
      if (this.state.BS==this.state.thisUser) this.setState({BS: ""});
      else this.setState({BS: player});
    } else if (pos=="BF") {
      if (this.state.BF==this.state.thisUser) this.setState({BF: ""});
      else this.setState({BF: player});
    }
  }

  createItem = (pos, userID) => {
    return (<ListItem style={{width: 200}}>
      <Button disabled={(userID=="" || userID==this.state.thisUser) ? false : true} onClick={()=>this.setUser(this.state.thisUser, pos)} style={{ height: 30 }} color='primary' variant='contained'>{pos}</Button>
      {userID}
    </ListItem>);
  }

  render() {
    return (
      <Paper>
        {this.createItem("RS", this.state.RS)}
        {this.createItem("RF", this.state.RF)}
        {this.createItem("BS", this.state.BS)}
        {this.createItem("BF", this.state.BF)}
      </Paper>
    );
  }
}