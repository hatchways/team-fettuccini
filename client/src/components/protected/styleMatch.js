export default (theme) => ({
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
  chatBox: {
    height: "20%",
    width: "20%",
    overflow: 'auto',
    justifyContent: "center",
    alignContent: "center",
    flexWrap: "wrap"
  },
  matchStyle: {
    display: "flex",
    flexDirection: "row"
  },
  flexRow: {
    margin: "10px",
    justifyContent: 'space-evenly',

    '&>.MuiGrid-item': {
      '&>button': {
        width: '100%'
      },
      "&>.chosenB": {
        backgroundColor: '#00008b',
        color: '#ffffff'
      },
      "&>.chosenR": {
        backgroundColor: '#8b0000',
        color: '#ffffff'
      },
      "&>.chosenA": {
        backgroundColor: '#000000',
        color: '#ffffff'
      },
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
  ".Mui-disabled": {
    backgroundColor: '#B319EB'
  }
});
