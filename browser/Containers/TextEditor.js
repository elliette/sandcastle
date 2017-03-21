import React from 'react';
import {apiKey, authDomain, databaseURL} from '../../secrets';
import firebase from 'firebase';
export default class TextEditor extends React.Component {

  constructor(props){
    super(props)
    this.init = this.init.bind(this);
  }

  componentDidMount(){
    this.init();
  }

  init(){
    // Get Firebase Database reference.
    var firepadRef = firebase.database().ref('/html');

    // Create CodeMirror (with lineWrapping on).
   var codeMirror = CodeMirror(document.getElementById('firepad'), {
        lineWrapping: true,
        lineNumbers: true,
        mode: 'javascript',
        matchBrackets: true,
        autoCloseBrackets: true,
        // matchTags: true,
        autoCloseTags: true,
        toggleComment: true,
        foldCode: true,
        hint: true
    });

    // Create Firepad (with rich text toolbar and shortcuts enabled).
    var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
      richTextShortcuts: false,
      richTextToolbar: false,
      defaultText: 'HTML here!'
    });
  }

  render () {
    return (
      <div className="container">
      <div>
        <div id="firepad" className="pagehalf"></div>
      </div>
        <div className="pagehalf">
        <img src="https://storage.googleapis.com/material-design/publish/material_v_10/assets/0Bx4BSt6jniD7MG80dmpHT0RidGs/style_icons_system_intro_principles_actionable.png"></img>
      </div>
      </div>
    )
  }
}
