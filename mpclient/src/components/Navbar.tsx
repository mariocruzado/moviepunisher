import React from "react";
import { IGlobalState } from "../reducers/global";
import { connect } from "react-redux";

import * as actions from "../actions";
import { RouteComponentProps } from "react-router";
import jwt from 'jsonwebtoken';

//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

interface IPropsGlobal {
  token: string;
  expirationId: number;

  setToken: (token: string) => void;
}

const Navbar: React.FC<IPropsGlobal & RouteComponentProps<any>> = props => {
    const logOut = () => {
        props.setToken('');
        localStorage.removeItem('token');
        window.clearTimeout(props.expirationId);
        props.history.push('/');
    }

    const currentUser = () => {
        const dToken = jwt.decode(props.token);
        if (dToken !== null && typeof dToken !== 'string') {
            return dToken.username;
        }
        return null;
    }

    return (
    <nav
      className="navbar is-dark"
      css={css`box-shadow:5px 5px 5px rgba(0,0,0,0.5) !important;width:100% !important;position:fixed !important;z-index:100;`}
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <img
            src="https://image.shutterstock.com/image-vector/cinema-alphabet-neon-sign-set-260nw-1074350261.jpg"
            width="112"
            height="28"
          />
        </a>

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
        <div className="navbar-start">
          <a className="navbar-item">Home</a>

          <a className="navbar-item">Documentation</a>

          <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link">More</a>

            <div className="navbar-dropdown">
              <a className="navbar-item">About</a>
              <a className="navbar-item">Jobs</a>
              <a className="navbar-item">Contact</a>
              <hr className="navbar-divider" />
              <a className="navbar-item">Report an issue</a>
            </div>
          </div>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <span>
              Welcome <b>{currentUser()}</b>
            </span>
          </div>
          <div className="navbar-item">
            <div className="buttons">
              <a className="button is-light" onClick={logOut}>
                Log Out
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
  expirationId: globalState.expirationId
});

const mapDispatchToProps = {
  setToken: actions.setToken
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
