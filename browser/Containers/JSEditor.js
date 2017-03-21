import React from 'react';
import firebase from 'firebase';

export default class JSEditor extends React.Component {

  constructor(props){
    super(props)
    this.init = this.init.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.state = {
      text: null
    }
  }


  componentDidMount(){
    this.init();
  }


  init(){
    // Get Firebase Database reference.
    var firepadRef = firebase.database().ref('/javascript');

    // Create CodeMirror (with lineWrapping on).
    var codeMirror = CodeMirror(document.getElementById('javascriptFirepad'), {
        lineWrapping: true,
        lineNumbers: true,
        mode: 'javascript',
        htmlMode: true,
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
      defaultText: 'JS here!'
    });

    const self = this;
    firepad.on('ready', function() {
      // Firepad is ready.
      self.setState({
        text: firepad.getText()
      })
    });
    firepad.on('synced', function(isSynced) {
      // isSynced will be false immediately after the user edits the pad,
      // and true when their edit has been saved to Firebase.
      if (isSynced) {
         self.setState({
         text: firepad.getText()
        })
      }
    });
 }

  handleSave(){
    const self = this;
    self.props.handlers.handleJSUpdate(this.state.text);
  }


  render() {
    console.log('props in js', this.props);
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <div id="javascriptFirepad"></div>
            <button
              type="button"
              className="btn btn-info"
              onClick={this.handleSave}>SAVE JS</button>
          </div>
          <div className="col-md-6">
            <img src="https://storage.googleapis.com/material-design/publish/material_v_10/assets/0Bx4BSt6jniD7MG80dmpHT0RidGs/style_icons_system_intro_principles_actionable.png"></img>
          </div>
        </div>
      </div>
    )
  }
}
