import axios from 'axios';
import { PROCESS_PAYMENT, ERROR, SAVE_PROFILE, USER_AUTH, LOGOUT, AUTH_ERROR, ADD_PLAYER, REMOVE_PLAYER, NEW_GAME, LIST_GAMES, DELETE_GAME, UPDATE_ERROR, SEND_EMAILS } from '../constants/actionTypes';
import moment from 'moment';

export const processPayment = (token, amount, game, user, callback) => async dispatch => {
  try {
    const response = await axios.post(
      `/api/save-stripe-token`, {
      token,
      amount,
      game: game.name,
      user: user.username
    }
    );
    dispatch({ type: PROCESS_PAYMENT, payload: response });
    callback(game, user);
  } catch (e) {
    dispatch({ type: ERROR, payload: 'Payment processing error. Please try again.'});
  }
}

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
    console.log(e)
    dispatch({ type: AUTH_ERROR, payload: 'Username or email is in use' });
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

export const removePlayer = (game, user, callback) => async dispatch => {
    try {
      const response = await axios.put(
        `/api/games/${game._id}/drop`,
        user
      );
      dispatch ({ type: REMOVE_PLAYER, payload: response.data });
      callback();
    } catch (e) {
      dispatch({ type: UPDATE_ERROR, payload: 'Sorry, an error occurred and you could not be added to this game.'})
    }
}

export const sendEmail = (game, messageDetails) => async dispatch => {
  try {
    const response = await axios.post(
      `/api/games/${game._id}/notification`,
      {...game, ...messageDetails}
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

export const cancelGame = (game, callback) => async dispatch => {
    if (moment(game.date).diff(moment().subtract(24, 'hours'), 'hours') < 24) {
      dispatch({ type: UPDATE_ERROR, payload: 'This game is scheduled to start in less than 24 hours and cannot be canceled.'})
    } else {
      try {
        const response = await axios.delete(
          `/api/games/${game._id}`,
          game
        );
        dispatch ({ type: DELETE_GAME, payload: response });
        callback();
      } catch (e) {
        dispatch({ type: UPDATE_ERROR, payload: 'Sorry, an error occurred and the game could not be created. Please try again.'})
      }
  }
}

export const saveProfile = (username, profile, callback) => async dispatch => {
  try {
    const response = await axios.put(
      `api/user/${username}`,
      profile
    );
    dispatch({ type: SAVE_PROFILE, payload: response.data });
    callback();
  } catch (e) {
    dispatch({ type: UPDATE_ERROR, payload: 'Sorry, an error occurred and your profile was not saved. Please try again.' })
  }
}
