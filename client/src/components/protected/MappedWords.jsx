import React from "react";
import json2mq from 'json2mq';
import { Typography, Grid, Card, Zoom, useMediaQuery } from "@material-ui/core";

export default ({ words, factions, classes, clickWord, spyView }) => {
  const screenSize = useMediaQuery(json2mq({ maxWidth: "1000px" }));

  return words.length === 0 ? null : (
    <div container className={classes.grid}>
      {words.map((word, i) => {
        const chosen = word[0] === "_"
        let wordsVal = chosen ? word.slice(2) : word

        let cardStyle = `chosen${word.slice(1, 2)}`;

        if (!chosen) {
          cardStyle = spyView() ? "buttonSpy" + factions[i].slice(0, 1) : "button"
        }

        return (
          <Card
            key={`word-${i}-${chosen}`}
            disabled="true"
            data-tag={i}
            variant="contained"
            className={`${classes[cardStyle]} ${classes.gridElement}`}
            onClick={clickWord}
          >
            <Typography variant="h5">
              <p className={screenSize ? classes.smallWords : ""}>{wordsVal}</p>
            </Typography>
          </Card>
        );
      })}
    </div>
  );
};
