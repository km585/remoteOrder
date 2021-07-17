import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import Root from './Root';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase/app'
import rootReducer from './reducks/store/store';
import { BrowserRouter as Router} from 'react-router-dom';



export const auth = firebase.auth();
export const storage = firebase.storage();
export const functions = firebase.functions();
export const FirebaseTimestamp = firebase.firestore.Timestamp;


export const store= createStore(rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);



console.log('初期値:', store.getState());



ReactDOM.render(
  <Provider store={store}>  
  <Router>
    <Root />
  </Router>
  
  </Provider>
  ,document.getElementById('root')
);


serviceWorker.unregister();