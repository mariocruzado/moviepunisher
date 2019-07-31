import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Main from './Main';
import Sidebar from './Sidebar';

const Layout:React.FC<any> = props => {
return (
    <BrowserRouter>
    <Route component={Navbar} />
    <Main></Main>


    </BrowserRouter>
);
}

export default Layout;