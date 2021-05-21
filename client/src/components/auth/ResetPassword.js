import React, { Fragment, useState } from 'react';
import { resetPassword } from '../../actions/auth';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types';

const ResetPassword = ({ setAlert, resetPassword, isAuthenticated }) => {
  let urlElements = window.location.href.split('/');
  let resetLink = '';
  resetLink = urlElements[5];
  //   const onSubmit = async (e) => {
  //     e.preventDefault();
  //     resetPassword(resetLink);
  //   };
  const [formData, setFormData] = useState({
    password: '',
    password2: '',
  });

  const { password, password2 } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Password do not match', 'danger');
    } else {
      console.log(resetLink);
      console.log(JSON.stringify({ password, resetLink }));
      resetPassword({ newPass: password, resetLink });
    }
  };
  // Redirect if Registered
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }
  return (
    <Fragment>
      <h2 className='text-primary'>
        You are almost done. To Reset Password to Your Account on Me2Me Please
        Enter New Password and Click on the Reset Password !
      </h2>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='password'
            placeholder='New Password'
            name='password'
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm New Password'
            name='password2'
            value={password2}
            onChange={(e) => onChange(e)}
          />
        </div>
        <input
          type='submit'
          className='btn btn-primary'
          value='Reset Password'
        />
      </form>
    </Fragment>
  );
};
ResetPassword.propTypes = {
  resetPassword: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, { setAlert, resetPassword })(
  ResetPassword
);
