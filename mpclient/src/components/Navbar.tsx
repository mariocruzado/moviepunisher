import React from "react";
import { IGlobalState } from "../reducers/global";
import { connect } from "react-redux";

import * as actions from "../actions";
import { RouteComponentProps } from "react-router";
import jwt from "jsonwebtoken";

//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Link } from "react-router-dom";
import { alphanumericChecker, searchBoxChecker } from "../tools/fieldChecker";
import { IPages } from "../interfaces";

interface IPropsGlobal {
  token: string;
  expirationId: number;
  pageInfo: IPages;

  reset: () => void;
  saveQuery: (query: string) => void;
  setPages: (pages: IPages) => void;
}

const Navbar: React.FC<IPropsGlobal & RouteComponentProps<any>> = props => {
  //Search Box
  const [search, setSearch] = React.useState("");
  const [roundSearchBox, setRoundSearchBox] = React.useState(false);
  const updateSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      !(event.currentTarget.value.charAt(0) === " ") &&
      event.currentTarget.value.length < 101 &&
      alphanumericChecker(event.currentTarget.value)
    ) {
      setSearch(event.currentTarget.value);
      setRoundSearchBox(false);
    }
  };

  const searchFilms = (search: string) => {
    if (searchBoxChecker(search)) {
      props.setPages({
        ...props.pageInfo,
        current: 1
      });
      props.saveQuery(`search/movie?query=${search}`);
      props.history.push("/");
    } else {
      setRoundSearchBox(true);
    }
  };

  const logOut = () => {
    props.reset();
    localStorage.removeItem("token");
    window.clearTimeout(props.expirationId);
    props.history.push("/");
  };

  const currentUser = () => {
    const dToken = jwt.decode(props.token);
    if (dToken !== null && typeof dToken !== "string") {
      return dToken;
    }
    return null;
  };

  return (
    <nav
      className="navbar is-light"
      css={css`
        box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.5) !important;
        position: fixed;
        top: 0px;
        width: 100% !important;
      `}
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <img
            src="https://logodix.com/logo/280318.png"
            width="112"
            height="28"
          />
        </a>
        <div className="navbar-item">
          <div className="field has-addons is-centered">
            <div className="control">
              <input
                onChange={updateSearch}
                value={search}
                className={`input searchbox ${
                  roundSearchBox ? "is-danger" : ""
                }`}
                type="text"
                placeholder="Try a search!"
              />
            </div>
            <div className="control">
              <a className="button" onClick={() => searchFilms(search)}>
                <i className="fas fa-search" />
              </a>
            </div>
          </div>
        </div>
        <a
          role="button"
          className="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-end">
          <div className="navbar-item">
            <span>
              {} <b>{currentUser()!.username}</b>
            </span>
          </div>
          <div className="navbar-item">
            <div className="buttons">
              <Link className="button is-primary" to={`/profile`}>
                <i className="fas fa-user-edit" />
              </Link>
              <a className="button is-danger" onClick={logOut}>
                <i className="fas fa-power-off" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const mapStateToProps = (globalState: IGlobalState) => ({
  token: globalState.token,
  expirationId: globalState.expirationId,
  pageInfo: globalState.storedPages
});

const mapDispatchToProps = {
  reset: actions.reset,
  setPages: actions.savePages,
  saveQuery: actions.saveQuery
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
