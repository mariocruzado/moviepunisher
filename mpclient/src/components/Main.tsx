import React from "react";
import { IGlobalState } from "../reducers/global";
import * as actions from "../actions";
import { connect } from "react-redux";
import FilmList from "../components/FilmList";
import { Switch, Route } from "react-router-dom";
import SingleFilm from "./SingleFilm";
import UserPanel from "./UserPanel";
//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const Main: React.FC<any> = props => {
  return (
    <section className="hero is-fullheight" css={css`background-color:rgb(30, 30, 30) !important;`}>
      <div
        className="mainsite"
        css={css`
          margin-top: 70px !important;
          margin-bottom:35px !important;
        `}
      >
        {/* Siempre poner el más específico primero */}
        <Switch>
          <Route path="/" exact component={FilmList} />
          <Route path="/profile" exact component={UserPanel} />
          <Route path="/:film_id" exact component={SingleFilm} />
        </Switch>
      </div>
      </section>
  );
};

export default Main;
