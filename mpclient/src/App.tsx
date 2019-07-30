import React from 'react';

//Redux
import * as actions from './actions';
import { IGlobalState } from './reducers/global';

//JWT
import jwt from 'jsonwebtoken';

//Css
import './App.css';
// import 'materialize-css';
// import 'materialize-css/dist/css/materialize.min.css';
import 'bulma/css/bulma.css';

//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

//Components
import Layout from './components/Layout';
import Login from './components/Login';

//Router
import { connect } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

const { Modal, Button } = require('react-materialize');

//Interfaces
interface IPropsGlobal {
  //Prop states
  token: string;

  //Prop functions
  setToken: (token:string) => void;
  setLoginExpiration: (id:number) => void;
}

const App: React.FC<IPropsGlobal> = (props) => {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {

    const token = localStorage.getItem('token');
    if (token) {
      //Calculating token expiration from localStorage
      const decToken: any = jwt.decode(token);
      const expTime = decToken.exp * 1000;
      const currTime = Number(new Date());
      const diffTime = expTime - currTime;

      if (diffTime > 0) {
        //If token has not expired, we save it in redux
        props.setToken(token);
        const logExpireId = window.setTimeout(() => props.setToken(''), diffTime);
        props.setLoginExpiration(logExpireId);
      } else {
        //If token has expired, remove it from local storage
        localStorage.removeItem('token');
      }
    }
    setReady(true);
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <BrowserRouter>
    {!props.token && <Login />}
    {props.token && <Layout />}
    </BrowserRouter>
  )
  return (
    <div>
      <Modal header="Hey!" trigger={<Button>Click here buddy</Button>}>
<p>Restrospecter</p>

      </Modal>
    </div>
  );
}

const mapStateToProps = (globalState:IGlobalState) => ({
  token: globalState.token
});

const mapDispatchToProps = {
  setToken: actions.setToken,
  setLoginExpiration: actions.setLoginExpiration
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
