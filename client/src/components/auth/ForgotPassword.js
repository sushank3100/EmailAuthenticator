import React, { Fragment, useState } from 'react';
// import axios from 'axios';
// import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
// import { setAlert } from '../../actions/alert';
import { forgotPassword } from '../../actions/auth';
import PropTypes from 'prop-types';

const ForgotPassword = ({ forgotPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
  });
  const { email } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    // console.log('Successfully ForgotPassworded', formData);
    forgotPassword({ email });
  };
  // Redirect if ForgotPassworded
  //   if (isAuthenticated) {
  //     return <Redirect to='/dashboard' />;
  //   }
  return (
    <Fragment>
      <h1 className='large text-primary'>Forgot Password</h1>
      <p className='lead'>
        If you‘d like to reset your password, please enter your email here and a
        link to do so will be sent to the address you enter.
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Submit' />
      </form>
    </Fragment>
  );
};

ForgotPassword.propTypes = {
  forgotPassword: PropTypes.func.isRequired,
};
export default connect(null, { forgotPassword })(ForgotPassword);
