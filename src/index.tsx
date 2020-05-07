import React from "react";
import { render } from "react-dom";
import { createStore, applyMiddleware } from "redux";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import rootReducer from "./store/reducers";
import thunk from "redux-thunk";
import { BrowserRouter as Router, Route } from "react-router-dom";

const store = createStore(rootReducer, undefined, applyMiddleware(thunk));

render(
  <Provider store={store}>
    <Router>
      <Route component={App} />
    </Router>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
