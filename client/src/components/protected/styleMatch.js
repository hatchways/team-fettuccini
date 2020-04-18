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
    height: '80%'
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
    '&>.MuiGrid-item': {
      '&>.button': {
        color: "#000000",
        backgroundColor: '#ffffff',
        width: '100%',
        height: '100%',
      },
      '&>.button:hover': {
        transform: "scale(1.3)"
      },
      "&>.chosenB": {
        backgroundColor: '#00008b',
        color: '#ffffff',
        width: '100%',
        height: '100%',
      },
      "&>.chosenR": {
        backgroundColor: '#8b0000',
        color: '#ffffff',
        width: '100%',
        height: '100%',
      },
      "&>.chosenA": {
        backgroundColor: '#000000',
        color: '#ffffff',
        width: '100%',
        height: '100%',
      },
    },

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
  }
});
