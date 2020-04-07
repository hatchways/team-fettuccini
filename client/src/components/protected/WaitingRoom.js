import React, { Fragment } from "react";
import { Typography, Paper, Button, FormLabel, TextField, Grid } from "@material-ui/core";
import LinkIcon from '@material-ui/icons/Link';
import CheckIcon from '@material-ui/icons/Check';

import { withStyles } from "@material-ui/core/styles";

import style from "./styleWaitingNewGame"

class WaitingRoom
  extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      matchId: '',
      email: '',
      list: ['You']
    }
  }

  componentDidMount = () => {
    if (this.props.location.state == null || this.props.match.params.matchId !== this.props.location.state.matchId) {
      this.props.history.push('/welcome')
    }
    const { matchId } = this.props.location.state
    this.setState({ ...this.state, matchId })
  }

  handleChange = (event) => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    let list = [...this.state.list, this.state.email]
    this.setState({ email: '', list })
  }

  copyLink = () => {
    this.textArea.value = this.state.matchId
    this.textArea.select();
    document.execCommand('copy')
  }

  startMatch = () => {
    const { matchId } = this.state
    this.props.history.push({
      pathname: `/match/${matchId}`,
      state: { matchId }
    })
  }

  render() {
    const { list, matchId } = this.state
    const { classes } = this.props;
    const mappedEmails = list.length > 0
      ? (this.state.list.map((email, idx) => (
        <div key={`invite${idx}`}>
          <CheckIcon className={classes.mainFill} />
          {email}
        </div>))) : null

    return <Fragment>
      <Paper className="MuiPaper-customPrimary">
        <Typography variant="h4">Match Id: {matchId}</Typography>
        {document.queryCommandSupported('copy') && <textarea
          readOnly
          ref={(textarea) => this.textArea = textarea}
          style={{ opacity: '0', position: 'absolute' }}
          value={this.state.matchId} />}
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item>
            <FormLabel>Players ready for match:</FormLabel>
            <div className={classes.leftText}>{mappedEmails}</div>
          </Grid>
          <Grid item>
            <FormLabel className={classes.centerText}>Share match id:</FormLabel>
            <Button variant="outlined" onClick={this.copyLink}><LinkIcon className={classes.rotate45} />Copy</Button>
          </Grid>
        </Grid>
        <div>
          <Button variant="contained" color="primary" onClick={this.startMatch}>Start Match</Button>
        </div>
      </Paper>
    </Fragment>
  }
}
export default withStyles(style)(WaitingRoom)
