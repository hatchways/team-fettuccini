import { emphasize } from "@material-ui/core/styles";

export default (theme) => ({
  centerText: {
    textAlign: "center",
  },
  leftText: {
    textAlign: "left",
  },
  gridContainer: {
    flexWrap: "wrap",
    justifyContent: "space-around",
    margin: "10px auto",
  },
  matchStyle: {
    display: "flex",
    flexDirection: "row",
    maxHeight: "90vh",
    justifyContent: "left",
  },
  grid: {
    display: "grid",
    gridTemplate: "repeat(5, 1fr) / repeat(5, 1fr)",

    width: "75%",
    height: "75%",
  },

  "@keyframes zoom": {
    from: { transform: "scale(0.7)" },
    to: { transform: "scale(1.0)" },
  },
  gridElement: {
    display: "flex",
    justifyContent: "center",
    // width: "100%",
    alignItems: "center",
    margin: "5px",

    animationName: "$zoom",
    animationDuration: "0.75s",
    animationDirection: "forward",
    animationTimingFunction: "ease-in-out",
    "&:hover": {
      transform: "scale(1.3)",
    },

    borderRadius: "5%",
    cursor: "pointer",
    padding: "5%",
    justifyContent: "space-evenly",
    "&>.button": {
      color: "#000000",
      backgroundColor: "#ffffff",
      width: "100%",
      height: "100%",
    },

    wordWrap: "break-word",
  },

  chosenB: {
    backgroundColor: "#00008b",
    color: "#ffffff",
  },
  chosenR: {
    backgroundColor: "#8b0000",
    color: "#ffffff",
  },
  chosenA: {
    backgroundColor: "#000000",
    color: "#ffffff",
  },

  chosenC: {
    backgroundColor: "#ffcc99",
    color: "#000000",
  },

  paper: {
    width: "80%",
    paddingTop: "10vh",
    height: "80vh",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    display: "flex",
  },
  ".Mui-disabled": {
    backgroundColor: "#B319EB",
  },
});
