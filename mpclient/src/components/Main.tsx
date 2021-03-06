import React from "react";
import { IGlobalState } from "../reducers/global";
import * as actions from "../actions";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from 'react-router-dom';
import SingleFilm from "./SingleFilm";
import UserPanel from "./UserPanel";
//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import FilmSearch from "./FilmSearch";
import FilmLocal from "./FilmLocal";
import PopularUsers from "./PopularUsers";
import UserEdit from "./UserEdit";
import Admin from "./Admin";

const Main: React.FC<any> = props => {
  return (
    <section className="hero is-fullheight" css={css`background-color:rgb(30, 30, 30) !important;`}>
      <div
        css={css`
          margin-top: 70px !important;
          margin-bottom:35px !important;
        `}
      >
        {/* Siempre poner el más específico primero */}
        <Switch>
          <Route path="/" exact component={FilmLocal} />
          <Route path="/search" exact component={FilmSearch} />
          <Route path="/popular" exact component={PopularUsers} />
          <Route path="/update" exact component={UserEdit} />
          <Route path="/admin" exact component={Admin} />
          <Route path="/film/:film_id" exact component={SingleFilm} />
          <Route path="/profile/:user_id" exact component={UserPanel} />
          <Redirect to="/" />
        </Switch>
      </div>
      </section>
  );
};

export default Main;
