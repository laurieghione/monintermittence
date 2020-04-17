import React from 'react';
import {render} from 'react-dom';
import { createStore, compose, applyMiddleware } from 'redux'
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import rootReducer from './store/reducers';
import thunk from 'redux-thunk';

const store = createStore(rootReducer, undefined, applyMiddleware(thunk))

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
