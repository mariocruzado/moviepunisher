import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Main from "./Main";

const Layout: React.FC<any> = props => {
  return (
    <BrowserRouter>
      <Route component={Navbar} />
      <Main />
    </BrowserRouter>
  );
};

export default Layout;
