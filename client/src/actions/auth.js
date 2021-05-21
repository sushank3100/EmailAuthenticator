import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_FAIL,
  ACTIVATION_SUCCESS,
  ACTIVATION_FAIL,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
} from './types';
import { setAlert } from './alert';
import setAuthToken from '../../src/utills/setAuthToken';
// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get('/api/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User
export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({ name, email, password });
    try {
      const res = await axios.post('/api/users', body, config);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      // dispatch(loadUser());
    } catch (error) {
      const errors = error.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };
// Login User
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ email, password });
  try {
    const res = await axios.post('/api/auth', body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((error) =>
        dispatch(setAlert('Invalid Credentials', 'danger'))
      );
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};
// Forgot Password
export const forgotPassword =
  ({ email }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({ email });
    try {
      const res = await axios.put('/api/forgot-password', body, config);
      dispatch({
        type: FORGOT_PASSWORD,
        payload: res.data,
      });
      dispatch(loadUser());
      dispatch(
        setAlert(
          'Email has been sent, kindly follow the instructions',
          'success'
        )
      );
    } catch (error) {
      const errors = error.response.data.errors;
      if (errors) {
        errors.forEach((error) =>
          dispatch(setAlert('Invalid Email', 'danger'))
        );
      }
      dispatch({
        type: FORGOT_PASSWORD_FAIL,
      });
    }
  };
// Activate the user
export const activateMail = (token) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ token });
  try {
    const res = await axios.post(`/api/email-activate`, body, config);
    dispatch({
      type: ACTIVATION_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
    dispatch(setAlert('Successfully Activated your Account', 'success'));
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((error) =>
        dispatch(
          setAlert(`Already Activated please go to login page`, 'danger')
        )
      );
    }
    dispatch({
      type: ACTIVATION_FAIL,
    });
  }
};
// Reset the Password
export const resetPassword = (bodyObj) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify(bodyObj);
  try {
    const res = await axios.put('/api/reset-password', body, config);
    dispatch({
      type: RESET_PASSWORD_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
    dispatch(setAlert('Successfully Updated your Password', 'success'));
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((error) =>
        dispatch(
          setAlert(
            `Password Updated if you want to change again!Please go to forgot password page`,
            'danger'
          )
        )
      );
    }
    dispatch({
      type: RESET_PASSWORD_FAIL,
    });
  }
};
