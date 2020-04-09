import React from "react";
import { Button, Grid } from "@material-ui/core";

export default ({ words, classes, clickWord }) => {
  if (words.length === 0) {
    return null
  }

  let mapped = []
  let low, high
  for (let i = 0; i < 6; i++) {
    low = i + 4 * i
    high = 5 * i + 5

    mapped.push(
      <Grid container item key={`row-${i}`} className={classes.flexRow}>

        {(words.slice(low, high)).map((word, inx) => (
          <Grid item xs={2} key={word.val}>
            <Button
              data-tag={Number(inx) + low}
              variant="contained"
              className={classes[`chosen_${word.chosen}`]}
              onClick={clickWord}>{word.val}</Button>
          </Grid>))}

      </Grid>
    )
  }

  return mapped
}
