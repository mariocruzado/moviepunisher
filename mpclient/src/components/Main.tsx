import React from "react";
import { IGlobalState } from '../reducers/global';
import * as actions from '../actions';
import { connect } from "react-redux";
import FilmList from '../components/FilmList';
import { Switch, Route } from 'react-router-dom';

const Main: React.FC<any> = props => {
  return (
    <Switch>
      <div className="layoutBackground">
          <div className="container mainsite">
      {/* Siempre poner el más específico primero */}
      <Route path="/" exact component={FilmList} />
      </div>
      </div>
    </Switch>
  );
};

export default Main;
