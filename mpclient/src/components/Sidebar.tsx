import React from "react";
import { IFilm } from "../interfaces";
import { IGlobalState } from "../reducers/global";
import * as actions from "../actions";
import { connect } from "react-redux";
import { Link, Route } from "react-router-dom";

interface IPropsGlobal {
  token: string;
}

const Sidebar: React.FC<IPropsGlobal> = props => {
  return (
    <div>
      <div className="list is-hoverable">
        <Link to={"/users/"} className="list-item mySideElement">
          Na
        </Link>
        <Link
          to={"/users/new"}
          className="list-item mySideElement has-background-danger has-text-dark"
        >
          New User
        </Link>
      </div>
    </div>
  );
};

const mapStateToProps = (globalState: IGlobalState) => ({
  token: globalState.token
});

export default connect(
  mapStateToProps,
  null
)(Sidebar);
