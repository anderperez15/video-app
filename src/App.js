import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { NotificationContainer } from 'react-notifications';

import './App.css';
import 'react-notifications/lib/notifications.css';

import Galery from './Pages/Galery';
import Editor from './Pages/Editor';


class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/" component={Galery} />
            <Route path="/galery" component={Galery} />
            <Route path="/procesar-video" component={Editor}/>
          </Switch>
        </Router>
        <NotificationContainer/>
      </div>
    );
  }
}

export default App;
