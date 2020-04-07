export default (theme) => ({
  centerText: {
    textAlign: 'center',
    marginBottom: "0.5em"
  },
  leftText: {
    textAlign: 'left'
  },
  gridContainer: {
    flexWrap: "wrap-reverse",
    justifyContent: "space-around",
    margin: "10px auto"
  },
  standardFlex: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  standardFlexChild: {
    flexGrow: '1',
  },
  mainFill: {
    fill: theme.palette.primary.main
  },
  rotate45: {
    transform: "rotate(-45deg)",
    margin: '1px'
  }
});
