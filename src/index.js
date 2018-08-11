import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';

import reducer from './redux/reducer'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

let store = createStore(reducer)

// console.log("INDEX", store.getState())

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('root'));
registerServiceWorker();
