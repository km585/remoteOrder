import {combineReducers} from 'redux';
import {BasketReducer, AccountReducer} from "../reducers";
import firebase from "firebase";





var config = {
    apiKey: "AIzaSyCHGkqxzc0slm_jplPdbMzVf-diK7_JIyw",
    authDomain: "smartorders-product-server.firebaseapp.com",
    databaseURL: "https://smartorders-product-server-default-rtdb.firebaseio.com",
    projectId: "smartorders-product-server",
    storageBucket: "smartorders-product-server.appspot.com",
    messagingSenderId: "503197113286",
    appId: "1:503197113286:web:cd78f0fc2591dc85cff0c7",
    measurementId: "G-QEV6V8110E"
  };

firebase.initializeApp(config);
firebase.analytics();





const rootReducer = combineReducers({
    BasketReducer,
    AccountReducer
});

export default rootReducer;
