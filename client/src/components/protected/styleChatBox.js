export default (theme) => ({
  buttonInput: {
	  width: "5%", 
	  height: "5%",
	  boxShadow: "2px 2px 2px 2px black",
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
	width: "40%",
	justifyContent: "center",
	flexWrap: "wrap",
  },
  chatBox: {
	width: "20%",
	maxHeight: "100%",
    justifyContent: "center",
    alignContent: "center",
    flexWrap: "wrap"
  }
});
