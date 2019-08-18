import React from "react";
import { IGlobalState } from "../reducers/global";
import { connect } from "react-redux";

import * as actions from "../actions";
import { RouteComponentProps } from "react-router";
import jwt from "jsonwebtoken";
import $ from 'jquery';

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
      props.history.push('/search');
    } else {
      setRoundSearchBox(true);
    }
  };

  //Enter event for button inside the form
  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchFilms(search);
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

  React.useEffect(() => {
    $(".navbar-burger").click(function() {
      $("#navbarMenuToggler, .navbar-burger").toggleClass("is-active");
    });
    $("#navbarMenuToggler .navbar-item").click(function() {
      $("#navbarMenuToggler, .navbar-burger").toggleClass("is-active");
    });
  },[]);

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
        <figure className="navbar-item">
          <img
            src={require('../img/logo.gif')}
            width="112"
          />
        </figure>
        <div className="navbar-item">
          <form onSubmit={onFormSubmit}>
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
              <button className="button" type="submit">
                <i className="fas fa-search" />
              </button>
            </div>
          </div>
          </form>
        </div>
        
        <a
          role="button"
          className="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          css={css`border-radius:10px`}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </a>
      </div>
      <div id="navbarMenuToggler" className="navbar-menu" css={css`z-index:1 !important`}>
      <div className="navbar-start">
          <Link className="navbar-item" to={'/'}>
                Home
          </Link>
          <Link className="navbar-item" to={'/popular'}>
                Popular Users
          </Link>
          <Link className="navbar-item" to={'/about'}>
                About
            </Link>
        </div>
        <div className="navbar-end">
          <div className="navbar-item">
            <span css={css`margin-left:0px !important;font-size:0.85em;`}>
              {'Logged as '} <Link className="has-text-weight-bold has-text-link" to={`/profile/${currentUser()!.id}`}>{currentUser()!.username}</Link>
            </span>
          </div>
          <div className="navbar-item">
            <div className="buttons">
              {currentUser()!.isAdmin && (
                   <Link className="button is-dark is-outlined" to={`/profile/${currentUser()!.id}`}>
                   <i className="fas fa-user-shield" />
                 </Link>           
              )}
              <Link className="button is-dark is-outlined" to={`/profile/${currentUser()!.id}`}>
                <i className="fas fa-user-edit" />
              </Link>
              <a className="button is-danger is-rounded is-outlined" onClick={logOut}>
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
  saveQuery: actions.saveQuery,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
