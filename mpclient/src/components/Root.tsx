import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from "./Login";
import Register from "./Register";

const Root: React.FC<any> = () => {
  return (
    <section className="hero is-info is-fullheight backgroundedbody">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <Switch>
              <Route path="/" exact component={Login} />
              <Route path="/register" exact component={Register} />
              <Redirect to='/' />
            </Switch>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Root;
