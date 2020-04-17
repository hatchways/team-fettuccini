import React, { useEffect } from 'react';
import { Button } from "@material-ui/core";

export default ({ ping }) => {
  //uncomment this for testing individual pings
  return <Button variant="outlined" onClick={ping}>ping</Button>;

  //comment this for testing individual pings
  /*
  useEffect(() => {
    const interval = setInterval(async () => {
      ping()
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return null;
  */

};
