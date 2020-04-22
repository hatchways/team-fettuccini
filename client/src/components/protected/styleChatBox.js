export default (theme) => ({
  listItem: {
    flexDirection: 'column',
    "&> .MuiTypography-subtitle1": {
      padding: "5% 15%",
    }
  },
  listItemred: {
    alignItems: 'flex-start',
    "&> .MuiTypography-subtitle1": {
      backgroundColor: "red",
      borderRadius: "0 10px 10px 10px"
    }
  },
  listItemblue: {
    alignItems: 'flex-end',
    "&> .MuiTypography-subtitle1": {
      backgroundColor: "#639dd8",
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
    minHeight: "80%",
    maxHeight: "80%",
    overflow: 'scroll'
  },
  numberLabel: {
    width: 20,
    appearance: "textfield"
  },
  inputBox: {
    width: "50%",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  chatBox: {
    width: "20vw",
    maxHeight: "95vh",
    justifyContent: "center",
    alignContent: "center",
    flexWrap: "wrap"
  },
  inputStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: 'left',
  }
});
