import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { withRouter } from "react-router-dom";

function GameOutcome(props) {
    const { isOver, winner, blueScore, redScore } = props;

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
        margin: "0px 0px 0px 0px",
        padding: "0px 98px"
      },
      img: {
        padding: "10px 0px 0px 40px"
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
      return "/dialog_icon.jpg"

    };

    return (
      <Dialog aria-labelledby="dialog-title" open={isOver}>
        <div className={styles.img}>
          <img alt="icon" src={getGameoutcomePicture()} style={styles.img}></img>
        </div>
        <DialogTitle id="dialog-title">
          <p style={styles.title}>Game over!</p>
        </DialogTitle>
        <div style={styles.wins}>
          <p style={getTeamColor()}>{winner} wins</p>
        </div>
        <div style={styles.score}>
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
            props.history.push("/welcome");
            props.setIsMatchInProgres(false);
          }}
        >
          New Game
        </Button>
      </Dialog>
    );
}

export default withRouter(GameOutcome);
