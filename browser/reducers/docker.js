const initialState = {
  json: '',
  database: [],
  dockerOn: false,
  port: null
};

// reducer
const reducer = (state = initialState, action) => {
  const newState = Object.assign({}, state);

  switch(action.type) {
    case RECEIVE_JSON:
      if (action.json.includes('Error') && action.json.includes('Cannot GET')) {
        newState.json = 'Error: Cannot GET';
      } else if (action.json.includes('Error') && action.json.includes('Cannot POST')) {
        newState.json = 'Error: Cannot POST';
      } else if (action.json.includes('Error') && action.json.includes('Cannot PUT')) {
        newState.json = 'Error: Cannot PUT';
      } else if (action.json.includes('Error') && action.json.includes('Cannot DELETE')) {
        newState.json = 'Error: Cannot DELETE';
<<<<<<< HEAD
      } else if (action.json.length && action.json.length < 4 && action.json !== "[]"){
        newState.json = `Deleted the entry with an id of ${action.json}.` 
=======
      } else if (action.json.length && action.json.length < 4){
        newState.json = `Deleted the entry with an id of ${action.json}.`
>>>>>>> master
      } else {
        newState.json = action.json;
      }
      return newState;

    case POST_TO_DB:
      newState.database = newState.database.concat(JSON.parse(action.post));
      return newState;

    case UPDATE_ENTRY:
      let entry = JSON.parse(action.entry);
      newState.database = newState.database.map(item => {
        if (item.id === entry.id){
          return entry
        } else {
          return item
        }
      });
      return newState;

    case DELETE_ENTRY:
      let deleteId = parseInt(action.id);
      newState.database = newState.database.filter(item => parseInt(item.id) !== deleteId);
      return newState;

    case CLEAR_DB:
      newState.database = [];
      return newState;

    case UPDATE_DOCKER:
      newState.dockerOn = action.bool;
      return newState;

    case RECEIVE_PORT:
      newState.port = action.port;
      return newState;

    default:
      return state;
  }
};

// constants
const RECEIVE_JSON = 'RECEIVE_JSON';
const POST_TO_DB = 'POST_TO_DB';
const UPDATE_DOCKER = 'UPDATE_DOCKER';
const RECEIVE_PORT = 'RECEIVE_PORT';
const CLEAR_DB = 'CLEAR_DB';
const DELETE_ENTRY = 'DELETE_ENTRY';
const UPDATE_ENTRY = 'UPDATE_ENTRY';

// action creators
export const receiveJson = json => ({
  type: RECEIVE_JSON,
  json
});

export const sendJson = (...args) => {
  return receiveJson(...args);
};

export const postToDB = post => ({
  type: POST_TO_DB,
  post
});


export const sendPost = (...args) => {
  return postToDB(...args);
};


export const updatePost = (entry) => ({
  type: UPDATE_ENTRY,
  entry
})

export const sendUpdate = (...args) => {
  return updatePost(...args);
}

export const deletePost = id => ({
  type: DELETE_ENTRY,
  id
});

export const sendDelete = (...args) => {
  return deletePost(...args);
}

export const clearDB = () => ({
  type: CLEAR_DB
});

export const sendClearDB = () => {
  return clearDB();
};

export const updateDockerOn = bool => ({
  type: UPDATE_DOCKER,
  bool
});

export const sendUpdateDockerOn = (...args) => {
  return updateDockerOn(...args);
};

export const receivePort = port => ({
  type: RECEIVE_PORT,
  port
});

export const sendPort = (...args) => {
  return receivePort(...args);
};

export default reducer;
