import React, {Component} from 'react';
import {connect} from 'react-redux'
import { Link } from 'react-router';
import firebase from 'firebase';

import HTMLEditor from './HTMLEditor';
import { updateHTML, updateCSS, updateJS, updateServer, updateDatabase, updateHTMLCSSJS } from '../reducers/code';
import LoadingButton from './LoadingButton';

class AppContainer extends Component {
  constructor(props){
    super(props)
  }

  componentDidMount() {
    // let types = ['html', 'css', 'javascript']
    // let ref, codeMirror, firepad;

    // types.forEach(type => {
    //   ref = firebase.database().ref(`/${type}`);
    //   codeMirror = CodeMirror(document.getElementById(`${type}Firepad`));

    //   firepad = Firepad.fromCodeMirror(ref, codeMirror);

    //   const self = this;
    //   // console.log('self', self);
    //   let handleType = (type === 'javascript') ? 'JS' : type.toUpperCase();
    //   let typeString = `handle${handleType}Update`;

    //   firepad.on('ready', function() {
    //     // Firepad is ready.
    //     console.log('ready');
    //     self.props.handlers[typeString](firepad.getText());
    //     console.log('done being ready');
    //   });
    //   firepad.on('synced', function(isSynced) {
    //     // isSynced will be false immediately after the user edits the pad,
    //     // and true when their edit has been saved to Firebase.
    //     if (isSynced) {
    //       self.props.handlers[typeString](firepad.getText());
    //     }
    //   });
    // })

    let cssRef = firebase.database().ref('/css');
    cssRef.on('child_changed', snapshot => {
      console.log(snapshot.val());
    })

  }

  render(){
    const children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        code: this.props.code,
        handlers: this.props.handlers
      })
    });
    return(
        <div>
            <nav className="navbar navbar-default">
              <div className="container-fluid">
                  <div className="navbar-header">
                      <Link className="navbar-brand" to="/">Text Editor</Link>
                  </div>
                  <ul className="nav navbar-nav nav-tabs">
                      <li><Link to="/html">HTML</Link></li>
                      <li><Link to="/css">CSS</Link></li>
                      <li><Link to="/javascript">Javascript</Link></li>
                      <li><Link to="/server">Server</Link></li>
                      <li><Link to="/database">Database</Link></li>
                  </ul>
                  <ul className="nav navbar-nav navbar-right">
                    <li><a href="#">Sign Up</a></li>
                    <li><a href="#">Sign In</a></li>
                  </ul>
              </div>
            </nav>
            <LoadingButton code={this.props.code} handlers={this.props.handlers} />
              {children}
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    code: state.code
  };
};

const mapDispatchToProps = (dispatch) => {
  return {handlers:
      {
        handleHTMLUpdate(...args) {
          dispatch(updateHTML(...args));
        },
        handleCSSUpdate(...args) {
          dispatch(updateCSS(...args));
        },
        handleJSUpdate(...args) {
          dispatch(updateJS(...args));
        },
        handleServerUpdate(...args) {
          dispatch(updateServer(...args));
        },
        handleDatabaseUpdate(...args) {
          dispatch(updateDatabase(...args));
        },
        handleHTMLCSSJSUpdate(...args) {
          dispatch(updateHTMLCSSJS(...args));
        }
      }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
