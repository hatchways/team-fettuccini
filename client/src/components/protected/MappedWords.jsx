import React from "react";
import { Typography, Grid, Card, Zoom } from "@material-ui/core";

export default ({ words, classes, clickWord }) => {
  return words.length === 0 ? null : (
    <div container className={classes.grid}>
      {words.map((word, i) => {
        const chosen = word[0] === "_";

        return (
          <Zoom
            key={`word-${i}-${chosen}`}
            direction="up"
            in="true"
            mountOnEnter
            unmountOnExit
          >
            <Card
              disabled={chosen}
              data-tag={i}
              variant="contained"
              className={`${
                chosen ? `${classes["chosen" + word.slice(1, 2)]}` : ""
              } ${classes.gridElement}`}
              onClick={clickWord}
            >
              <Typography variant="h5">
                {chosen ? word.slice(2) : word}
              </Typography>
            </Card>
          </Zoom>
        );
      })}
    </div>
  );
};
