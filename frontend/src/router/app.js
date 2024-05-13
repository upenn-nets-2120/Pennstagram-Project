import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import NavBar from './NavBar';
import Home from './Home';
import Profile from './Profile';
import Friends from './Friends';
import Chat from './Chat';
import Search from './Search';
import Feed from './Feed';
import Post from './Post';

const App = () => {
    return (
        <Router>
            <NavBar />
            <Route path="/" exact component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/friends" component={Friends} />
            <Route path="/chat" component={Chat} />
            <Route path="/search" component={Search} />
            <Route path="/feed" component={Feed} />
            <Route path="/post" component={Post} />
        </Router>
    );
};

export default App;