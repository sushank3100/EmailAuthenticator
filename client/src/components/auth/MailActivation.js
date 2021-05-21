import React, { Fragment } from 'react';
import { activateMail } from '../../actions/auth';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
const MailActivation = ({ activateMail }) => {
  let urlElements = window.location.href.split('/');
  let token = '';
  token = urlElements[5];
  const onSubmit = async (e) => {
    e.preventDefault();
    activateMail(token);
  };
  return (
    <Fragment>
      <h2 className='text-primary'>
        You are almost done. To Activate Your Account on Me2Me Please Click on
        the Activate Account !
      </h2>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <input
          type='submit'
          className='btn btn-primary'
          value='Activate Account'
        />
      </form>
    </Fragment>
  );
};
MailActivation.propTypes = {
  activateMail: PropTypes.func.isRequired,
};
export default connect(null, { activateMail })(MailActivation);
