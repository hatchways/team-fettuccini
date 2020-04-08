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
      title: { fontSize: "30px", margin: "0px", fontFamily: "Roboto" },
    };

    const getTeamColor = () => {
      if (winner == "blue") {
        return styles.blue;
      } else {
        return styles.red;
      }
    };

    return (
      <Dialog aria-labelledby="dialog-title" open={isOver}>
        <div>
          <p>Icon</p>
        </div>
        <DialogTitle id="dialog-title">
          <p style={styles.title}>Game over!</p>
        </DialogTitle>
        <div>
          <p style={getTeamColor()}>{winner} wins</p>
          <p>
            <span style={styles.blue}>{blueScore} </span> :{" "}
            <span style={styles.red}> {redScore}</span>
          </p>
        </div>

        <Button
          onClick={() => {
            this.props.history.push("/welcome");
          }}
        >
          New Game
        </Button>
      </Dialog>
    );
  }
}

export default withRouter(GameOutcome);
