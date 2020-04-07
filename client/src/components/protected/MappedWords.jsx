import React, { Component, Fragment } from "react";
import { Button, Grid } from "@material-ui/core";

const mapRow = (words) => words.map(word => (
  <Grid item xs={4} key={word} className="standardFlexChild">
    <Button variant="contained">{word}</Button>
  </Grid>))

export default ({ words }) => {

  let mapped = []
  let low, high
  for (let i = 0; i < 6; i++) {
    low = i + 4 * i
    high = 5 * i + 5

    mapped.push(
      <Grid container item spacing={1} key={`row-${i}`}>
        {mapRow(words.slice(low, high))}
      </Grid>
    )
  }

  return mapped
}
