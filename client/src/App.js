import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import ForgotPassword from './components/auth/ForgotPassword';
import MailActivation from './components/auth/MailActivation';
import ResetPassword from './components/auth/ResetPassword';
import Alert from './components/layout/Alert';
import { Provider } from 'react-redux';
// Redux
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utills/setAuthToken';
// import PrivateRoute from './components/routing/PrivateRoute';
import './App.css';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <section className='className container'>
            <Alert />
            <Switch>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/forgot-password' component={ForgotPassword} />
              <Route
                exact
                path='/api/email-activate/:id'
                component={MailActivation}
              />
              <Route
                exact
                path='/api/reset-password/:newPass'
                component={ResetPassword}
              />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
