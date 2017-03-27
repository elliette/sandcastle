'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import {Promise} from 'bluebird';
import AppContainer from './Containers/AppContainer';
import SignUp from './Containers/SignUp';
// import WelcomeMessage from './Components/WelcomeMessage';
import {apiKey, authDomain, databaseURL} from '../secrets';
import firebase from 'firebase';
import store from './store';
import {Provider} from 'react-redux';
import { setUserId } from './reducers/user';
import makeFirepads from './utils/firepads';
// import { updateHTML, updateCSS, updateJS, updateServer, updateDatabase } from './reducers/code';
import * as updateActions from './reducers/code';
import makeFrontendIframe from './utils/makeFrontendIframe';
import axios from 'axios';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

injectTapEventPlugin(); //need this for the progress indicator

const onAppEnter = () => {

  // initialize firebase
  var config = { apiKey, authDomain, databaseURL };
  firebase.initializeApp(config);

  // let user = firebase.auth().currentUser;

  let madeFirepads = false;
  let madeFrontendIframe = false;

  firebase.auth().onAuthStateChanged((user) => {
    console.log("USER IN ON APP ENTER", user);

    if (user) {
      let userId = user.uid;
      store.dispatch(setUserId(userId))

      axios.post('/setUser', {userId: userId})
      .then(() => {
          console.log('posting userid');
      })
      .catch(console.error);

      // if user is logged in add an event listener to window to check if user is leaving page
      // send get request to server to remove container if container is running
      window.addEventListener("beforeunload", function (e) {
        e.preventDefault();
        console.log('WINDOW');
        console.log('EVENT');

        axios.get('/removeContainer')
        .then((res) => {
          console.log('removing container');
          console.log('res', res)
        })
        .catch(console.error);

        // var confirmationMessage = "\o/";
        // e.returnValue = confirmationMessage;
        // return confirmationMessage;
      });

      // render firepads
      if (madeFirepads === false) {
        let firepads = makeFirepads();
        let allFirepads = firepads[0];
        let orderManifesto = ['HTML', 'CSS', 'JS', 'Server', 'Database'];
        let count = 0;

        madeFirepads = true;

        const updatingText = Promise.map(allFirepads, (pad, i) => {
          return new Promise((resolve, reject) => {
            pad.on('ready', () => {
              store.dispatch(updateActions[`update${orderManifesto[i]}`](pad.getText()));
              count++;
              console.log('COUNT', count);
              resolve();
            });
          });
        });

        updatingText.then(() => {
          if (madeFrontendIframe === false && count === 5) {
            makeFrontendIframe();
            madeFrontendIframe = true;
          }
        });

        const syncing = Promise.map(allFirepads, (pad, i) => {
          return new Promise((resolve, reject) => {
            pad.on('sync', isSynced => {
              if (isSynced) store.dispatch(updateActions[`update${orderManifesto[i]}`](pad.getText()));
              resolve();
            });
          });
        });
      }
    } else {
      store.dispatch(setUserId(''));
    }
  });
};

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>
    <Router history={browserHistory}>
      <Route path="/" component={AppContainer} onEnter={onAppEnter}>
        <Route path="/signup" component={SignUp} />
      </Route>
    </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('app')
);

        // allFirepads.forEach((pad, i) => {
        //   pad.on('ready', () => {
        //     if (i === 0) {
        //       store.dispatch(updateHTML(pad.getText()));
        //       count++;
        //     }
        //     if (i === 1) {
        //       store.dispatch(updateCSS(pad.getText()));
        //       count++;
        //     }
        //     if (i === 2) {
        //       store.dispatch(updateJS(pad.getText()));
        //       count++;
        //     }
        //     if (i === 3) {
        //       store.dispatch(updateServer(pad.getText()));
        //       count++;
        //     }
        //     if (i === 4) {
        //       store.dispatch(updateDatabase(pad.getText()));
        //       count++;
        //     }
        //     if (madeFrontendIframe === false && count === 5) {
        //       makeFrontendIframe();
        //       madeFrontendIframe = true;
        //     }
        //   });
          // pad.on('synced', isSynced => {
          //   if (isSynced) {
          //     if (i === 0) store.dispatch(updateHTML(pad.getText()));
          //     if (i === 1) store.dispatch(updateCSS(pad.getText()));
          //     if (i === 2) store.dispatch(updateJS(pad.getText()));
          //     if (i === 3) store.dispatch(updateServer(pad.getText()));
          //     if (i === 4) store.dispatch(updateDatabase(pad.getText()));
          //   }
          // });


        // user set timout if codemirror autorefresh stops working
        // const codeMirrorInstances = pads[1];
        // setTimeout(() => {
        //   console.log('refreshing code mirrors');
        //   pads[1].forEach(pad => {pad.refresh();});
        // }, 1);
