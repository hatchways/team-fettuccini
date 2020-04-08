import React from "react";
import { Button, Grid } from "@material-ui/core";

const mapRow = (words) => words.map(word => (
  <Grid item xs={2} key={word}>
    <Button variant="contained">{word}</Button>
  </Grid>))

export default ({ words, classes }) => {
  console.log(words)
  if (words.length > 0) {
    let mapped = []
    let low, high
    for (let i = 0; i < 6; i++) {
      low = i + 4 * i
      high = 5 * i + 5

      mapped.push(
        <Grid container item key={`row-${i}`} className={classes.flexRow}>
          {mapRow(words.slice(low, high))}
        </Grid>
      )
    }

    return mapped
  } else {
    return null
  }
}
