import React from "react";
import { Typography, Card, Grid } from "@material-ui/core";

export default ({ words, factions, classes, clickWord, spyView }) => {

	function getCard(i, chosen, cardStyle, wordsVal) {
		console.log(wordsVal, "hello");
		if (!chosen) {
          if (spyView && factions[i] != "UNKNOWN") {
            cardStyle = "buttonSpy" + factions[i].slice(0, 1)
          } else {
            cardStyle = "button";
          }
        }
        console.log(cardStyle);
		return (
          <Grid style={{ height: "100%" }} item xs={2}>
	          <Card
	            key={`word-${i}-${chosen}`}
	            data-tag={i}
	            variant="contained"
	            className={`${classes[cardStyle]} ${classes.gridElement} ${chosen ? classes.noHover : null}`}
	            style={{ height: "100%", width: "100%" }}
	            onClick={clickWord}
	          >
	            <Typography variant="h5" className={classes.smallWords}>
	              {wordsVal}
	            </Typography>
	          </Card>
	      </Grid>
        );
	}

	function cardForGrid(i) {
		const chosen = words[i][0] === "_";
		return getCard(i, chosen, `chosen${words[i].slice(1, 2)}`,  chosen ? words[i].slice(2) : words[i]);

	}
	const columnSpace = 10;
    const xs = "auto";
    const rowStyle ={ height: "30%" };
  return words.length === 0 ? null : (
    
    <Grid container alignItems="center" justify="center" style={{ margin: "0%"}} spacing={6}>
    	<Grid item style={rowStyle} alignItems="center" justify="center" container spacing={columnSpace}>
    		{cardForGrid(0)}
    		{cardForGrid(1)}
    		{cardForGrid(2)}
    		{cardForGrid(3)}
    		{cardForGrid(4)}
    	</Grid>
    	<Grid item style={rowStyle} alignItems="center" justify="center" container spacing={columnSpace}>
    		{cardForGrid(5)}
    		{cardForGrid(6)}
    		{cardForGrid(7)}
    		{cardForGrid(8)}
    		{cardForGrid(9)}
    	</Grid>
    	<Grid item style={rowStyle} alignItems="center" justify="center" container spacing={columnSpace}>
    		{cardForGrid(10)}
    		{cardForGrid(11)}
    		{cardForGrid(12)}
    		{cardForGrid(13)}
    		{cardForGrid(14)}
    	</Grid>
    	<Grid item style={rowStyle} alignItems="center" justify="center" container spacing={columnSpace}>
    		{cardForGrid(15)}
    		{cardForGrid(16)}
    		{cardForGrid(17)}
    		{cardForGrid(18)}
    		{cardForGrid(19)}
    	</Grid>
    	<Grid item style={rowStyle} alignItems="center" justify="center" container spacing={columnSpace}>
    		{cardForGrid(20)}
    		{cardForGrid(21)}
    		{cardForGrid(22)}
    		{cardForGrid(23)}
    		{cardForGrid(24)}
    	</Grid>
    </Grid>
  );
};
