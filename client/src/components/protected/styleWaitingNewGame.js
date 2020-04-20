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
  },
  outlined: {
    border: `1px solid ${theme.palette.common.gray}`,
    borderRadius: "12px",
    "&>.MuiInputBase-root": {
      "&>.MuiInputBase-input": {
        textAlign: 'center'
      }
    }
  },
  darkGray: {
    backgroundColor: theme.palette.common.darkGray,
    color: theme.palette.primary.contrastText
  },
  hiddenText: {
    opacity: '0',
    position: 'absolute'
  },
  [theme.breakpoints.up('md')]: {
    borderLeft: {
      position: 'relative',
      "&:before": {
        content: 'close-quote',
        height: "100%",
        width: "2px",
        position: "absolute",
        backgroundColor: theme.palette.common.gray,
        left: '-14px',
        top: '60%',
        transform: 'translateY(-50%)'
      }
    }
  },
  [theme.breakpoints.down('xs')]: {
    centerMobile: {
      textAlign: 'center'
    }
  }
});
