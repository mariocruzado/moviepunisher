import React from "react";
import { IGlobalState } from "../reducers/global";
import { connect } from "react-redux";

import * as actions from "../actions";
import { RouteComponentProps } from "react-router";
import jwt from 'jsonwebtoken';

//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Link } from 'react-router-dom';

interface IPropsGlobal {
  token: string;
  expirationId: number;

  reset:() => void;
}

const Navbar: React.FC<IPropsGlobal & RouteComponentProps<any>> = props => {
  
    const logOut = () => {
        props.reset();
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
      css={css`box-shadow:0px 5px 5px rgba(0,0,0,0.5) !important;position:fixed;top:0px;width:100% !important;`}
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
              {} <b>{currentUser()}</b>
            </span>
          </div>
          <div className="navbar-item">
            <div className="buttons">
              <a className="button is-primary" onClick={logOut}>
              <i className="fas fa-user-edit"></i>
              </a>
              <a className="button is-danger" onClick={logOut}>
              <i className="fas fa-power-off"></i>
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
  reset: actions.reset
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
