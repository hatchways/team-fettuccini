import React from "react";
import json2mq from 'json2mq';
import { Typography, Grid, Card, Zoom, useMediaQuery } from "@material-ui/core";

export default ({ words, classes, clickWord }) => {
    const screenSize = useMediaQuery(json2mq({
      maxWidth: "1000px",
    }),
  );
  return words.length === 0 ? null : (
    Array(5)
      .fill([])
      .map((_, index) => (
        <Grid container item key={`row-${index}`} className={classes.flexRow}>
          {(words.slice(5 * index, 5 * (index + 1))).map((word, i) => {
            const chosen = word[0] === "_"
            const currIndex = i + 5 * index

            let wordsVal = (<p>{chosen ? word.slice(2) : word}</p>)
            if (screenSize) wordsVal=(<p className={classes.smallWords}>{chosen ? word.slice(2) : word}</p>);
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
                      {wordsVal}
                    </Typography>
                  </Card>
                </Grid>
              </Zoom>)

          })}
        </Grid>
      ))
  )
}
