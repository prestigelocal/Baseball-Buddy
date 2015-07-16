import React from 'react';
import FastClick from 'fastclick';
import Router, { Route, DefaultRoute, HistoryLocation } from 'react-router';
import App from './components/App.js';
import Scoreboard from './components/Scoreboard.js';

new Promise((resolve) => {
  if (window.addEventListener) {
    window.addEventListener('DOMContentLoaded', resolve);
  } else {
    window.attachEvent('onload', resolve);
  }
}).then(() => {
  FastClick.attach(document.body);

  let routes = (
    <Route handler={App}>
      <Route name="scoreboard" path=":date?" handler={Scoreboard} />
    </Route>
  );

  Router.run(routes, HistoryLocation, (Handler, state) => {
    React.render(<Handler params={state.params} />, document.body);
  });
});
