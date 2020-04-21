import React from "react";

import { Paper, Button, List, ListItem, Input } from "@material-ui/core";

export default class UserDisplay extends React.Component {

  createItem = (pos, userID) => {
    return (<ListItem style={{width: 200}}>
      <Button disabled={(userID=="" || userID==this.props.thisUser) ? false : true} onClick={()=>this.props.onJoin(this.props.thisUser, pos)} style={{ height: 30 }} color='primary' variant='contained'>{pos}</Button>
      {userID}
    </ListItem>);
  }

  render() {
    return (
      <Paper>
        {this.createItem("RS", this.props.RS)}
        {this.createItem("RF", this.props.RF)}
        {this.createItem("BS", this.props.BS)}
        {this.createItem("BF", this.props.BF)}
      </Paper>
    );
  }
}