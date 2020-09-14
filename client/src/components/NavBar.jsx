import React, { Fragment } from "react";
import { useHistory } from "react-router-dom";
import { Typography, Button } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import PersonIcon from "@material-ui/icons/Person";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@material-ui/core/Grid";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import auth from "./auth/auth";

import { makeStyles } from "@material-ui/core/styles";

import { buttonColors } from './protected/styleMatch'
import fetchUtil from './protected/fetchUtil'

const useStyles = makeStyles((theme) => ({
  blue: {
    color: buttonColors.blue,
    fontSize: "25px",
    fontWeight: "600",
    fontFamily: "Roboto",
  },
  waitingroomHeader: {
    display: "flex",
    flexWrap: "wrap-reverse",
    justifyContent: "space-between",
    backgroundColor: "white",
    textAlign: "center",
    fontSize: "30px",
  },
  basicHeader: {
    display: "flex",
    flexWrap: "wrap-reverse",
    justifyContent: "space-between",
    textAlign: "center",
    marginLeft: "auto",
    marginRight: 'auto',
    fontSize: "30px",
  },
  gameHeader: {
    display: "flex",
    flexWrap: "wrap-reverse",
    justifyContent: "space-between",
    textAlign: "center",
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '150px'
  },
  invisible: {
    opacity: "0",
    "&:hover": {
      cursor: "default",
    },
  },
  navSides: {
    flexGrow: "1",
  },
  navMain: {
    flexGrow: "1",
    fontFamily: "Roboto",
    fontWeight: "bold",
    backgroundColor: "white",
    color: "#000000",
    "&>.MuiToolbar-root": {
      display: "flex",
      justifyContent: "space-between",
      [theme.breakpoints.down('xs')]: {
        flexWrap: "wrap"
      }
    }
  },
  red: {
    color: buttonColors.red,
    fontSize: "25px",
    fontWeight: "600",
    fontFamily: "Roboto",
  },
  bar: {
    fontSize: "25px",
    fontWeight: "bold",
  },
  typography: {
    fontSize: "25px"
  },
  myprofile: {
    marginLeft: theme.spacing(40)
  }
}));

export default function NavBar(props) {
  let history = useHistory();
  const classes = useStyles(props);
  const [anchorEl, setAnchorEl] = React.useState(false);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(false);
  };

  const titleStyle = auth.isAuthenticated() && props.isMatchInProgres ? classes.typography : classes.basicHeader;

  return (

    <AppBar position="sticky" className={classes.navMain}>
      <Toolbar  >

        <Typography variant="typography" className={titleStyle}>
          CLUEWORDS
        </Typography>

        {auth.isAuthenticated() ? (
          <Fragment>
            {props.isMatchInProgres ? (
              <Fragment>
                <Grid container direction="row" className={classes.gameHeader}>
                  <Grid item direction="column" className={classes.waitingroomHeader}>
                    <Grid item>
                      <span className={classes.blue}>{props.blueScore}</span>
                    </Grid>
                    <Grid item>
                      <span className={classes.blue} style={{ fontSize: "10px" }}>Blue Team</span>
                    </Grid>
                  </Grid>

                  <Grid item className={classes.waitingroomHeader}>
                    -
                  </Grid>

                  <Grid item direction="column" className={classes.waitingroomHeader}>
                    <Grid item>
                      <span className={classes.red}>{props.redScore}</span>
                    </Grid>
                    <Grid item>
                      <span className={classes.red} style={{ fontSize: "10px" }}>Red Team</span>
                    </Grid>
                  </Grid>
                </Grid>

                <div>
                  <Button
                    className={classes.navSides}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      props.setIsMatchInProgres(false);
                      history.push("/welcome");
                    }}
                  >
                    New game
                  </Button>
                </div>
              </Fragment>
            ) : null}
            <div>
              <ListItem>
                <Avatar alt="demo_picture" src="/profile_icon.jpg">
                </Avatar>
                <Button onClick={handleOpenMenu} style={{ fontFamily: "Roboto" }}>My profile</Button>
              </ListItem>
            </div>
            <Menu
              id="menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem
                style={{ fontFamily: "Roboto" }}
                onClick={() => {
                  auth.signout(() => {
                    history.push("/");
                    setAnchorEl(false);
                    props.setIsMatchInProgres(false);
                  });
                }}
              >
                Signout
              </MenuItem>
			  
			  <MenuItem
                style={{ fontFamily: "Roboto" }}
                onClick={async () => {
					try {
						history.push({
							pathname: `/profile`
						});
				    } catch (error) {
				      console.log('failed to create new game', error)
				    }
                    
                }}
              >
                Profile
              </MenuItem>
            </Menu>
          </Fragment>
        ) : null}
      </Toolbar>
    </AppBar >

  );
}
