import { buttonColors } from "./styleMatch.js";

export default (theme) => ({
  listItem: {
    flexDirection: 'column',
    "&> .MuiTypography-subtitle1": {
      padding: "5% 10%",
    }
  },
  listItemred: {
    alignItems: 'flex-start',
    "&> .MuiTypography-subtitle1": {
      backgroundColor: buttonColors.red,
      borderRadius: "0 10px 10px 10px",
      color: '#ffffff'
    }
  },
  listItemredfield: {
    alignItems: 'flex-start',
    "&> .MuiTypography-subtitle1": {
      backgroundColor: theme.palette.common.gray,
      borderRadius: "0 10px 10px 10px"
    }
  },
  listItemblue: {
    alignItems: 'flex-end',
    "&> .MuiTypography-subtitle1": {
      backgroundColor: buttonColors.blue,
      borderRadius: "10px 0 10px 10px",
      color: '#ffffff'
    }
  },
  listItembluefield: {
    alignItems: 'flex-end',
    "&> .MuiTypography-subtitle1": {
      backgroundColor: theme.palette.common.gray,
      borderRadius: "10px 0 10px 10px"
    }
  },
  buttonInput: {
    width: "5%",
    height: "5%",
    boxShadow: "1px 1px 1px 1px black",
    marginRight: "1%",
    marginLeft: "1%"
  },
  chatList: {
    height: "60vh",
    overflowY: 'scroll',
    overflowX: 'scroll',
  },
  numberLabel: {
    width: 20,
    appearance: "textfield"
  },
  chatBox: {
    width: "25vw",
    height: "88vh",
    height: "100%",
    justifyContent: "center",
    alignContent: "center",
    flexWrap: "wrap",
  },
  chatForm: {
    margin: "5px auto",
    textAlign: "center",
    height: "20vh"
  },
  inputStyle: {
    display: "flex",
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    margin: "10px 5px"
  },
  inputBox: {
    width: "100px",
    "&>input": {
      textAlign: 'center'
    }
  },
  inlineGrid: {
    display: 'inline-grid',
    gridTemplateColumns: "repeat(3, 1fr)",
    width: "60px",
  },
  numInput: {
    textAlign: 'center'
  },
  plusMinus: {
    textAlign: 'center',
    padding: "2px",
    minWidth: 'unset',
    width: "1.75em",
    height: "1.75em"
  },
  [theme.breakpoints.down('sm')]: {
    chatList: {
      height: "55vh"
    }
  }
});
