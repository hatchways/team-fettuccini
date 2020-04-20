import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { withRouter } from "react-router-dom";

class GameOutcome extends Component {
  render() {
    const { isOver, winner, blueScore, redScore } = this.props;
    const winningTeamName = winner.charAt(0).toUpperCase() + winner.slice(1);

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
      title: { fontSize: "30px", margin: "0px", fontFamily: "Roboto" },
      newGame: { padding: "0 30px" },
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
          <p style={getTeamColor()}>{winningTeamName} wins</p>
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
