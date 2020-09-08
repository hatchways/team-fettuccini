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
    
    const rowIndices = [[0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14], [15,16,17,18,19], [20,21,22,23,24]];
  return words.length === 0 ? null : (
    <Grid container alignItems="center" justify="center" style={{ margin: "0%"}} spacing={6}>
	    {
	    	rowIndices.map((row) => {
	    		const cells = row.map((card) => {
	    			return cardForGrid(card);
	    		});
	    		return (
	    			<Grid item container alignItems="center" justify="center" spacing={columnSpace}>
	    				{cells};
	    			</Grid>
	    		);
	    	})
	    }
    </Grid>
   );
};
