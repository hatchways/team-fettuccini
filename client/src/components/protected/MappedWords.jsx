import React from "react";
import { Typography, Grid, Card, Zoom } from "@material-ui/core";

export default ({ words, classes, clickWord }) => {

  return words.length === 0 ? null : (
    Array(5)
      .fill([])
      .map((_, index) => (
        <Grid container item key={`row-${index}`} className={classes.flexRow}>
          {(words.slice(5 * index, 5 * (index + 1))).map((word, i) => {
            const chosen = word[0] === "_"
            const currIndex = i + 5 * index

            return (
              <Zoom key={`word-${currIndex}-${chosen}`} direction="up" in="true" mountOnEnter unmountOnExit>
                <Grid item xs={2} key={`word-${currIndex}`} className={classes.flexRow}>
                  <Card
                    disabled={chosen}
                    data-tag={i + 5 * index}
                    variant="contained"
                    className={chosen ? `chosen${word.slice(1, 2)}` : "button"}
                    onClick={clickWord}>
                    <Typography variant="h5">
                      <p>{chosen ? word.slice(2) : word}</p>
                    </Typography>
                  </Card>
                </Grid>
              </Zoom>)

          })}
        </Grid>
      ))
  )
}
