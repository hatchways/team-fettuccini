import React, { useEffect } from 'react';
import { Button } from "@material-ui/core";

export default ({ ping }) => {

  useEffect(() => {
    const interval = setInterval(async () => {
      ping()
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return null;
  // return <Button variant="outlined" onClick={ping}>ping</Button>;
};
