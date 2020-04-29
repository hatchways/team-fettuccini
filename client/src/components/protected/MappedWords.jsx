import React from "react";
import { Typography, Card } from "@material-ui/core";

export default ({ words, factions, classes, clickWord, spyView }) => {

  return words.length === 0 ? null : (
    <div container className={classes.grid}>
      {words.map((word, i) => {
        const chosen = word[0] === "_"
        let wordsVal = chosen ? word.slice(2) : word

        let cardStyle = `chosen${word.slice(1, 2)}`;

        if (!chosen) {
          if (spyView && factions[i] != "UNKNOWN") {
            cardStyle = "buttonSpy" + factions[i].slice(0, 1)
          } else {
            cardStyle = "button";
          }
        }

        return (
          <Card
            key={`word-${i}-${chosen}`}
            data-tag={i}
            variant="contained"
            className={`${classes[cardStyle]} ${classes.gridElement} ${chosen ? classes.noHover : null}`}
            onClick={clickWord}
          >
            <Typography variant="h5" className={classes.smallWords}>
              {wordsVal}
            </Typography>
          </Card>
        );
      })}
    </div>
  );
};
