import React, { Component, Fragment } from "react";
import { Paper, Grid } from "@material-ui/core";

import MappedWords from './MappedWords'

import { withStyles } from "@material-ui/styles";

const style = (theme) => ({
  centerText: {
    textAlign: 'center',
    marginBottom: "0.5em"
  },
  leftText: {
    textAlign: 'left'
  },
  gridContainer: {
    flexWrap: "wrap",
    justifyContent: "space-around",
    margin: "10px auto"
  },
  standardFlex: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  flexRow: {
    margin: "10px",
    justifyContent: 'space-evenly',
    '&>.MuiGrid-item': {
      '&>button': {
        width: '100%'
      }
    }
  },
  standardFlexChild: {
    flexGrow: '1',
  },
  paper: {
    margin: "50px auto",
    padding: "20px",
    maxWidth: "700px",
  },
  chosen_false: {
    backgroundColor: '#3FBF8A'
  },
  chosen_true: {
    backgroundColor: '#B319EB'
  }
});

class Match extends Component {
  constructor(props) {
    super(props)
    this.state = {
      matchId: '',
      words: [],
      turn: ''
    }
  }
  componentDidMount = () => {
    if (this.props.location.state == null || this.props.match.params.matchId !== this.props.location.state.matchId) {
      this.props.history.push('/welcome')
    }
    const { matchId, matchState } = this.props.location.state
    console.log(matchState)

    const words = matchState.info.map(word => ({ val: word, chosen: false }))

    this.setState({ ...this.state, matchId, words })
  }

  clickWord = (e) => {
    const { state } = this
    const { words } = state

    let index = e.currentTarget.dataset.tag;
    words[index].chosen = true;
    this.setState({ ...state, words })
  }

  render() {
    const { classes } = this.props;
    const { words } = this.state;
    return (<Fragment>
      <Grid container spacing={0} className={classes.gridContainer}>
        <Grid item xs={4}>
          <Paper>
            Chat
        </Paper>
        </Grid>
        <Paper className={classes.paper}>
          <Grid container item xs={12} className={classes.standardFlex}>
            <MappedWords classes={classes} words={words} clickWord={this.clickWord} />
          </Grid>
        </Paper>
      </Grid>
    </Fragment>)
  }
}

export default withStyles(style)(Match)
