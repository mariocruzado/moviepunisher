import React from "react";
import { IGlobalState } from "../reducers/global";
import * as actions from "../actions";
import { connect } from "react-redux";
import FilmList from "../components/FilmList";
import { Switch, Route } from "react-router-dom";
import SingleFilm from "./SingleFilm";
import UserPanel from "./UserPanel";

const Main: React.FC<any> = props => {
  return (
    <div className="layoutBackground">
      <div className="mainsite">
        {/* Siempre poner el más específico primero */}
        <Switch>
          <Route path="/" exact component={FilmList} />
          <Route path="/profile" exact component={UserPanel} />
          <Route path="/:film_id" exact component={SingleFilm} />
        </Switch>
      </div>
    </div>
  );
};

export default Main;
