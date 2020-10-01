import React from "react";

import { Paper, Button, List, ListItem, Input } from "@material-ui/core";

export default function UserDisplay(props) {

  const createItem = (pos, userID) => {
    return (<ListItem style={{width: 200}}>
      <Button disabled={(userID=="" || userID==props.thisUser) ? false : true} onClick={()=>props.onJoin(props.thisUser, pos)} style={{ height: 30 }} color='primary' variant='contained'>{pos}</Button>
      {userID}
    </ListItem>);
  }

    return (
      <Paper>
        {createItem("RS", props.RS)}
        {createItem("RF", props.RF)}
        {createItem("BS", props.BS)}
        {createItem("BF", props.BF)}
      </Paper>
    );
}