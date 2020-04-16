import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { withRouter } from "react-router-dom";

class GameOutcome extends Component {
  render() {
    const { isOver, winner, blueScore, redScore } = this.props;

    const styles = {
      blue: {
        color: "#1E90FF",
        fontSize: "20px",
        fontWeight: "600",
        fontFamily: "Roboto",
      },
      red: {
        color: "#FA8072",
        fontSize: "20px",
        fontWeight: "600",
        fontFamily: "Roboto",
      },
      sides: {
        flexGrow: "1",
      },
      title: {
        fontSize: "30px",
        margin: "0px",
        fontFamily: "Roboto",
        textAlign: "center",
        padding: "20px 16px 0px 16px"
      },
      newGame: { padding: "0 30px" },
      wins: {
        padding: "8px 0px 0px 74px",
        margin: "0"
      },
      score: {
        margin: "0px",
        padding: "0px 98px"
      },
      img: {
        marginRight: "auto",
        marginLeft: "auto"
      }
    };

    const getTeamColor = () => {
      if (winner == "Blue") {
        return styles.blue;
      } else {
        return styles.red;
      }
    };

    const getGameoutcomePicture = () => {
      // if joker is chosen, show scal
      // otherwise, winning 
      return "/profile_icon.jpg"

    };

    return (
      <Dialog aria-labelledby="dialog-title" open={isOver}>
        <div className={styles.img}>
          <img alt="icon" src={getGameoutcomePicture()}></img>
        </div>
        <DialogTitle id="dialog-title">
          <p style={styles.title}>Game over!</p>
        </DialogTitle>
        <div style={styles.wins}>
          <p style={getTeamColor()}>{winner} wins</p>
          <p>
            <span style={styles.blue}>{blueScore} </span> :{" "}
            <span style={styles.red}> {redScore}</span>
          </p>
        </div>

        <Button
          className={styles.sides}
          variant="contained"
          color="primary"
          onClick={() => {
            this.props.history.push("/welcome");
            this.props.setIsMatchInProgres(false);
          }}
        >
          New Game
        </Button>
      </Dialog>
    );
  }
}

export default withRouter(GameOutcome);
