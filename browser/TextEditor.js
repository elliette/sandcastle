import React from 'react';


  // function init() {
  //   // Initialize Firebase.
  //   // TODO: replace with your Firebase project configuration.
  //   var config = {
  //     apiKey: "AIzaSyB1xdBIiIAKNQc108oqcqieLBF2A0oSmYA",
  //     authDomain: "firepad-test-38417.firebaseapp.com",
  //     databaseURL: "https://firepad-test-38417.firebaseio.com"
  //   };
  //   firebase.initializeApp(config);

  //   // Get Firebase Database reference.
  //   var firepadRef = firebase.database().ref();

  //   // Create CodeMirror (with lineWrapping on).
  //  // var codeMirror = CodeMirror(document.getElementById('firepad'), { lineWrapping: true });
  // // <div ref="firepad" id="firepad"></div>
  //  var codeMirror = CodeMirror(this.refs.firepad, { lineWrapping: true });

  //   // Create Firepad (with rich text toolbar and shortcuts enabled).
  //   var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
  //     richTextShortcuts: true,
  //     richTextToolbar: true,  
  //     defaultText: 'This is in a script tag in index.html!'
  //   });
  // }


export default class TextEditor extends React.Component {

  constructor(props){
    super(props)
    this.init = this.init.bind(this); 
  }


  componentDidMount(){
    this.init(); 
  }


  init(){
    var config = {
      apiKey: "AIzaSyB1xdBIiIAKNQc108oqcqieLBF2A0oSmYA",
      authDomain: "firepad-test-38417.firebaseapp.com",
      databaseURL: "https://firepad-test-38417.firebaseio.com"
    };
    firebase.initializeApp(config);

    // Get Firebase Database reference.
    var firepadRef = firebase.database().ref();

    // Create CodeMirror (with lineWrapping on).
   // var codeMirror = CodeMirror(document.getElementById('firepad'), { lineWrapping: true });
  // <div id="firepad"></div>
   var codeMirror = CodeMirror(this.refs.firepad, { lineWrapping: true });

    // Create Firepad (with rich text toolbar and shortcuts enabled).
    var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
      richTextShortcuts: true,
      richTextToolbar: true,  
      defaultText: 'Hello World!'
    });

  }


  render () {
    return (
      <div ref="firepad"></div>
    )
  }
}