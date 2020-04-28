export const buttonColors = {
  blue: '#1E90FF',
  red: '#FA8072'
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
    color: buttonColors.blue,
    backgroundColor: '#ffffff'
  },
  buttonSpyR: {
    color: buttonColors.red,
    backgroundColor: '#ffffff'
  },
  buttonSpyC: {
    color: theme.palette.common.darkGray,
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
    backgroundColor: theme.palette.common.gray,
    color: theme.palette.common.darkGray
  },
  noHover: {
    "&:hover": {
      cursor: 'initial'
    }
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
  standardFlex: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  matchStyle: {
    display: "flex",
    flexDirection: "row",
    maxHeight: "80vh",
  },
  flexRow: {
    margin: "10px",
    justifyContent: 'space-evenly',
  },

  p: {
    margin: "auto", /* Important */
    textAlign: "center",
  },

  paper: {
    width: "80%",
    paddingTop: "5vh",
    height: "80vh",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    display: "flex",
    [theme.breakpoints.down('sm')]: {
      paddingTop: "2vh",
      height: "75vh",
    }
  },
  ".Mui-disabled": {
    backgroundColor: '#B319EB'
  },
  smallWords: {
    [theme.breakpoints.down('sm')]: {
      fontSize: "0.8rem"
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: "0.7rem"
    },
  },
  grid: {
    display: "grid",
    gridTemplate: "repeat(5, 1fr) / repeat(5, 1fr)",
    width: "90%",
    height: "100%",
    maxHeight: "55vh",
    margin: "0 auto",
  },
  gridElement: {
    display: "flex",
    alignItems: "center",
    margin: "7px",
    borderRadius: "7px",
    cursor: "pointer",
    wordWrap: "break-word",
    justifyContent: "space-evenly"
  }
});
