import React from 'react';
import firebase from 'firebase';

export default class ServerEditor extends React.Component {

  constructor(props){
    super(props)
    this.init = this.init.bind(this);
  }


  componentDidMount(){
    this.init();
  }


  init(){
    // Get Firebase Database reference.
    var firepadRef = firebase.database().ref('/server');

    // Create CodeMirror (with lineWrapping on).
   var codeMirror = CodeMirror(document.getElementById('firepad-container'), {
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
      defaultText: 'Server here!'
    });
  }

  render () {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <div id="firepad-container"></div>
          </div>
          <div className="col-md-6">
            <img src="https://storage.googleapis.com/material-design/publish/material_v_10/assets/0Bx4BSt6jniD7MG80dmpHT0RidGs/style_icons_system_intro_principles_actionable.png"></img>
          </div>
        </div>
      </div>
    )
  }
}
