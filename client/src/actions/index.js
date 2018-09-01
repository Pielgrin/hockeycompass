import axios from 'axios';
import { USER_AUTH, LOGOUT, AUTH_ERROR, ADD_PLAYER, NEW_GAME, LIST_GAMES, UPDATE_ERROR, SEND_EMAILS } from '../constants/actionTypes';

export const doRegister = (user, callback) => async dispatch => {
  try {
  const response = await axios.post(
    `/api/register`,
    user
  );
  dispatch({ type: USER_AUTH, payload: response.data });
  localStorage.setItem('token', response.data.token);
  callback();
} catch (e) {
    dispatch({ type: AUTH_ERROR, payload: 'Email in use' });
  }
}


export const doLogin = (user, callback) => async dispatch => {
  try {
    const response = await axios.post(
      `/api/login`,
      user
    );
    dispatch ({ type: USER_AUTH, payload: response.data });
    localStorage.setItem('token', response.data.token);
    callback();
  } catch (e) {
  dispatch({ type: AUTH_ERROR, payload: 'Invalid login credentials' });
}
}

export const doLogout = () => {
  localStorage.removeItem('token');
  return {
    type: LOGOUT,
    payload: ''
  }
}

export const addPlayer = (game, user, callback) => async dispatch => {
    try {
      const response = await axios.put(
        `/api/games/${game._id}`,
        user
      );
      dispatch ({ type: ADD_PLAYER, payload: response.data });
      callback();
    } catch (e) {
      dispatch({ type: UPDATE_ERROR, payload: 'Sorry, an error occurred and you could not be added to this game.'})
    }
}

export const sendEmails = game => async dispatch => {
  try {
    const response = await axios.post(
      `/api/games/${game._id}/notification`,
      game
    );
    dispatch ({ type: SEND_EMAILS, payload: response.data });
  } catch (e) {
    dispatch({ type: UPDATE_ERROR, payload: 'Sorry, an error occurred; emails were not sent.'})
  }
}

export const newGame = (game, callback) => async dispatch => {
    try {
      const response = await axios.post(
        `/api/games`,
        game
      );
      dispatch ({ type: NEW_GAME, payload: response });
      callback();
    } catch (e) {
      dispatch({ type: UPDATE_ERROR, payload: 'Sorry, an error occurred and the game could not be created. Please try again.'})
    }
}

export const listGames = () => async dispatch => {
    try {
      const response = await axios.get(`/api/games`);
      dispatch ({ type: LIST_GAMES, payload: response });
    } catch (e) {
      dispatch({ type: UPDATE_ERROR, payload: 'Sorry, we couldn\t complete this request right now. Please try again.'})
    }
}
