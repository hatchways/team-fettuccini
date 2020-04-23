export const buttonColors = {
  blue: '#00008b',
  red: '#8b0000',
  civilian: '#ffcc99'
}

export default (theme) => ({
  button: {
    color: "#000000",
    backgroundColor: '#ffffff',
    animationName: "$zoom",
    animationDuration: "0.75s",
    animationDirection: "forward",
    animationTimingFunction: "ease-in-out",
    "&:hover": {
      transform: "scale(1.3)"
    }
  },
  buttonSpyA: {
    color: "#000000",
    backgroundColor: '#ffffff'
  },
  buttonSpyB: {
    color: "#00008b",
    backgroundColor: '#ffffff'
  },
  buttonSpyR: {
    color: "#8b0000",
    backgroundColor: '#ffffff'
  },
  buttonSpyC: {
    color: "#ffcc99",
    backgroundColor: '#ffffff'
  },
  chosenB: {
    backgroundColor: buttonColors.blue,
    color: '#ffffff'
  },
  chosenR: {
    backgroundColor: buttonColors.red,
    color: '#ffffff'
  },
  chosenA: {
    backgroundColor: '#000000',
    color: '#ffffff'
  },
  chosenC: {
    backgroundColor: buttonColors.civilian,
    color: '#000000'
  },
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
  gridElement: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "5px"
  },
  standardFlex: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  matchStyle: {
    display: "flex",
    flexDirection: "row",
    minHeight: "100vh",
    maxHeight: "100vh",
    justifyContent: 'left',
  },
  flexRow: {
    margin: "10px",
    justifyContent: 'space-evenly',
    '&>.MuiTypography-h5': {
      display: "flex",
      width: "50%",
      height: "200px",
      margin: "auto",
      borderRadius: "10px",
      border: "3px dashed #1c87c9",
    },
  },

  p: {
    margin: "auto", /* Important */
    textAlign: "center",
  },

  paper: {
    padding: "20px",
    width: '80vw',
    height: '90vh'
  },
  ".Mui-disabled": {
    backgroundColor: '#B319EB'
  },

  smallWords: {
    fontSize: "10px"
  },
  grid: {
    display: "grid",
    gridTemplate: "repeat(5, 1fr) / repeat(5, 1fr)",
    width: "90%",
    height: "75%",
    margin: "0 auto"
  }
});
