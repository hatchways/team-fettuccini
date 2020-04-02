import React, { Fragment } from "react";

import { Typography, Paper, Button, FormLabel, TextField } from "@material-ui/core";
import LinkIcon from '@material-ui/icons/Link';
import CheckIcon from '@material-ui/icons/Check';

export default class NewGame extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      list: []
    }
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
    console.log(this.textArea.value)
    this.textArea.value = 'game_url'
    this.textArea.select();
    document.execCommand('copy')
  }

  render() {
    console.log('props', this.props)

    const { list } = this.state

    const mappedEmails = list.length > 0 ? (this.state.list.map((email, idx) => (
      <div key={`invite${idx}`}>
        <CheckIcon variant="checkIcon" />
        {email}&nbsp;
        <span className="italic">invited</span>
      </div>))) : null

    return <Fragment>
      <Paper>
        <Typography variant="h4">New Game</Typography>
        <div>
          <div>
            <form onSubmit={this.handleSubmit}>
              <FormLabel htmlFor="email">Invite friends via email:</FormLabel>
              {document.queryCommandSupported('copy') && <textarea
                ref={(textarea) => this.textArea = textarea}
                style={{ opacity: '0', position: 'absolute' }}
                value={this.state.email} />}

              <TextField
                variant="outlined"
                className='Form-text-input'
                name="email"
                id="email"
                type="email"
                value={this.state.email}
                onChange={this.handleChange}
                placeholder="Email address"
                required />
              <Button variant="contained" type="submit">Send invite</Button>
            </form>
            {mappedEmails}
          </div>
          <div>
            <FormLabel>Or share link:</FormLabel>
            <Button variant="outlined" onClick={this.copyLink}><LinkIcon />Copy</Button>
            <CheckIcon variant="colorPrimary" />
            <CheckIcon />
          </div>
        </div>
        <div>
          <Button variant="contained" color="primary">create game</Button>
        </div>
      </Paper>
    </Fragment>
  }
}
