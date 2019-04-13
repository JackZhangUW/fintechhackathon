import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import firebase from 'firebase/app';

// Initialize Firebase
var config = {
	apiKey: "AIzaSyDV_BkgbJgAvlzVuecEaXOc-MOkjUeRXgE",
	authDomain: "def-hac.firebaseapp.com",
	databaseURL: "https://def-hac.firebaseio.com",
	projectId: "def-hac",
	storageBucket: "def-hac.appspot.com",
	messagingSenderId: "618946944978"
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
