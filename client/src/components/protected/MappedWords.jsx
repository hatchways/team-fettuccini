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

        {(words.slice(low, high)).map((word, inx) => {
          const chosen = word[0] === "_"

          return (
            <Grid item xs={2} key={`word-${inx}`}>
              <Button
                disabled={chosen}
                key={word}
                data-tag={Number(inx) + low}
                variant="contained"
                className={chosen ? `chosen${word.slice(1, 2)}` : ""}
                onClick={clickWord}>{chosen ? word.slice(2) : word}</Button>
            </Grid>)
        })}

      </Grid>
    )
  }

  return mapped

  // return words.length === 0 ? null : (
  //   Array(5)
  //     .fill([])
  //     .map((_, index) => (
  //       <Grid container item key={`row-${index}`} className={classes.flexRow}>
  //         {(words.slice(5 * index, 5 * (index + 1))).map((word, inx) => (
  //           <Grid item xs={2} key={word.val}>
  //             <Button
  //               key={word.val}
  //               data-tag={Number(inx) + 5 * (inx + 1)}
  //               variant="contained"
  //               className={classes[`chosen_${word.chosen}`]}
  //               onClick={clickWord}>{word.val}</Button>
  //           </Grid>))}
  //       </Grid>
  //     ))
  // )
}
