import axios from 'axios';

const initialState = {
  htmlString: '',
  cssString: '',
  jsString: '',
  serverString: '',
  databaseString: ''
};

// reducer
const reducer = (state = initialState, action) => {
  console.log('ACTION', action);
  const newState = Object.assign({}, state);
  switch(action.type) {
    case RECEIVE_HTML:
      newState.htmlString = action.htmlString;
      return newState;

    case RECEIVE_CSS:
      newState.cssString = action.cssString;
      return newState;

    case RECEIVE_JS:
      newState.jsString = action.jsString;
      return newState;

    case RECEIVE_SERVER:
      newState.serverString = action.serverString;
      return newState;

    case RECEIVE_DATABASE:
      newState.databaseString = action.databaseString;
      return newState;

    case RECEIVE_HTML_CSS_JS:
      newState.htmlString = action.htmlString;
      newState.cssString = action.cssString;
      newState.jsString = action.jsString;
      return newState;

    default:
      return state;
  }
};

// constants
const RECEIVE_HTML = 'RECEIVE_HTML';
const RECEIVE_CSS = 'RECEIVE_CSS';
const RECEIVE_JS = 'RECEIVE_JS';
const RECEIVE_SERVER = 'RECEIVE_SERVER';
const RECEIVE_DATABASE = 'RECEIVE_DATABASE';
const RECEIVE_HTML_CSS_JS = 'RECEIVE_HTML_CSS_JS';

// action creators
export const receiveHTML = htmlString => ({
  type: RECEIVE_HTML,
  htmlString
});

export const receiveCSS = cssString => ({
  type: RECEIVE_CSS,
  cssString
});

export const receiveJS = jsString => ({
  type: RECEIVE_JS,
  jsString
});

export const receiveServer = serverString => ({
  type: RECEIVE_SERVER,
  serverString
});

export const receiveDatabase = databaseString => ({
  type: RECEIVE_DATABASE,
  databaseString
});

export const receiveHTMLCSSJS = (htmlString, cssString, jsString) => ({
  type: RECEIVE_HTML_CSS_JS,
  htmlString,
  cssString,
  jsString
});

export const updateHTML = (...args) => {
  return receiveHTML(...args);
};

export const updateCSS = (...args) => {
  return receiveCSS(...args);
};

export const updateJS = (...args) => {
  return receiveJS(...args);
};

export const updateServer = (...args) => {
  return receiveServer(...args);
};

export const updateDatabase = (...args) => {
  return receiveDatabase(...args);
};

export const updateHTMLCSSJS = (...args) => {
  return receiveHTMLCSSJS(...args);
};

export default reducer;
