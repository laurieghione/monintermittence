import React from 'react';
import {render} from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { declarationReducer } from './store/reducer';
export {actionCreators as DeclarationActionCreators } from './store/action';


let store = createStore(declarationReducer);
//store.dispatch({ type: "ADD_DECLARATION", declaration : new Declaration()});


render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
