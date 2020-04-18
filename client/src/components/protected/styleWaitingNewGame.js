export default (theme) => ({
  availableRoles: {
    maxWidth: "160px",
    margin: "0 auto",
  },
  listItem: {
    justifyContent: "center",
    textAlign: "center"
  },
  itemText: {
    flex: "unset"
  },
  iconHover: {
    "&:hover": {
      cursor: "pointer",
      opacity: "0.8"
    }
  },
  verticalAlign: {
    alignItems: "center",
    display: "flex"
  },
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
