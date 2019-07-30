import React from 'react';

//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

//JWT
import jwt from 'jsonwebtoken';
import { IGlobalState } from '../reducers/global';
import * as actions from '../actions';
import { connect } from 'react-redux';

//Field checker
import '../tools/fieldChecker';
import { usernameChecker, passwordChecker } from '../tools/fieldChecker';

interface IPropsGlobal {
    expirationId: number;

    setToken: (token: string) => void;
    setLoginExpiration: (id: number) => void;
};

const Login:React.FC<IPropsGlobal> = (props) => {
    //default States for fields
    const [user, setUser] = React.useState('');
    const [pass, setPass] = React.useState('');
    const [label, setLabel] = React.useState('');

    //Updating users by filling the inputs
    const updateUser = (event: React.ChangeEvent<HTMLInputElement>) => 
    setUser(event.currentTarget.value);
    const updatePass = (event: React.ChangeEvent<HTMLInputElement>) => 
    setPass(event.currentTarget.value);

    //Enable button to sign in
    const enableButton = () => {
        let res = true;
        if (usernameChecker(user) && passwordChecker(pass)) res = false;
        return res;
    }
    //Authenticate user
    const auth = () => {
        fetch('http://localhost:8080/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            }, 
            body: JSON.stringify({
                username: user,
                password: pass
            })
        }).then(response => {
            if (response.ok) {
                response.text().then(token => {
                    //Saving token in redux & local storage
                    props.setToken(token);
                    localStorage.setItem('token', token);
                    //Clearing previous timeouts
                    window.clearTimeout(props.expirationId);

                    //New timeOut needs to be created
                    const decToken: any = jwt.decode(token);
                    const expTime = decToken.exp * 1000;
                    const currTime = Number(new Date());
                    const diffTime = expTime - currTime;

                    const logExpireId = window.setTimeout(() => props.setToken(''), diffTime);
                    props.setLoginExpiration(logExpireId);

                });
            } else if (response.status === 401) setLabel('* Username/Password is wrong!')
        });
    };

    //Rendering component
    return (
        <section className="hero is-info is-fullheight">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-5-tablet is-4-desktop is-3-widescreen">
                <div className="box" css={css`box-shadow:7px 7px 5px rgba(0,0,0,0.5) !important;`}>
                  <div className="field is-vcentered">
                    <div className="columns is-vcentered">
                      <h5 className="column has-text-info">Welcome</h5>
                    </div>
                  </div>
                  <div className="field">
                    <div className="control has-icons-left">
                      <input
                        type="text"
                        placeholder="username123"
                        className={`input ${usernameChecker(user)? 'is-success':''}`}
                        onChange={updateUser}
                        value={user}
                        required
                        data-testid="username_input"
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-user" />
                      </span>
                    </div>
                  </div>
                  <div className="field">
                    <div className="control has-icons-left">
                      <input
                        type="password"
                        placeholder="*******"
                        className={`input ${passwordChecker(pass)? 'is-success':''}`}
                        onChange={updatePass}
                        value={pass}
                        data-testid="password_input"
                        required
                      />
                      <span className="icon is-small is-left">
                        <i className="fa fa-lock" />
                      </span>
                    </div>
                  </div>
                  {label && (
                    <div className="field">
                      <small
                        data-testid="invalid_span"
                        className="has-text-danger"
                      >
                        {label}
                      </small>
                    </div>
                  )}
                  <div className="field">
                    <button
                      className="button is-link"
                      onClick={auth}
                      disabled={enableButton()}
                      data-testid="auth_button"
                    >
                      Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}

const mapStateToProps = (globalState:IGlobalState) => ({
    expirationId: globalState.expirationId
});

const mapDispatchToProps = {
    setToken: actions.setToken,
    setLoginExpiration: actions.setLoginExpiration
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);