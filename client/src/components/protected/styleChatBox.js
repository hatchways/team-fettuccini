export default (theme) => ({
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
  }
});
