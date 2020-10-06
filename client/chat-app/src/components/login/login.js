import React, { Component } from 'react';
import NavBarComponent from '../navbar/navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { url } from '../configs/config';
import './login.css';
import { Link } from 'react-router-dom';

export default class LoginComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogging: false,
      email: '',
      password: '',
    };
  }
  componentWillMount() {
    if (localStorage.getItem('token')) {
      this.props.history.push('/dashboard');
    }
  }

  //onchange handler
  handleChange = (e) => {
    let { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      value = checked;
    }

    this.setState({
      [name]: value,
    });
  };

  //handling the form submit
  handleSubmit = (e) => {
    e.preventDefault();
    //show loading
    this.setState({
      isLogging: true,
    });
    setTimeout(() => {
      this.setState({
        isLogging: false,
      });
    }, 2000);
    //api call
    axios
      .post(`${url}/auth/login`, {
        email: this.state.email,
        password: this.state.password,
      })
      .then((data) => {
        //show toast msg data.data.msg
        toast.success(data.data.msg);
        //store token in localstorage
        if (data.data.token) {
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('user', data.data.user);
        }
        if (localStorage.getItem('token') && localStorage.getItem('user')) {
          this.props.history.push('/dashboard');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    var btnLogin = this.state.isLogging ? (
      <button
        className='btn btn-lg btn-primary btn-block text-uppercase'
        type='submit'>
        Logging In...
      </button>
    ) : (
      <button
        className='btn btn-lg btn-primary btn-block text-uppercase'
        type='submit'>
        Log In
      </button>
    );
    return (
      <>
        <div className='loginscreen my-0 py-0'>
          <NavBarComponent />
          <div className='container'>
            <div className='row'>
              <div className='col-sm-9 col-md-7 col-lg-5 mx-auto'>
                <div className='card card-signin my-5'>
                  <div className='card-body'>
                    <h5 className='card-title text-center'>Log In</h5>
                    <form className='form-signin' onSubmit={this.handleSubmit}>
                      <div className='form-label-group'>
                        <label htmlFor='inputEmail'>Email address</label>
                        <input
                          type='email'
                          id='inputEmail'
                          name='email'
                          onChange={this.handleChange}
                          className='form-control'
                          placeholder='Email address'
                          required
                          autofocus
                        />
                      </div>
                      <div className='form-label-group'>
                        <label htmlFor='inputPassword'>Password</label>
                        <input
                          type='password'
                          id='inputPassword'
                          className='form-control'
                          name='password'
                          onChange={this.handleChange}
                          placeholder='Password'
                          required
                        />
                      </div>
                      <div className='custom-control custom-checkbox mb-3'>
                        <input
                          type='checkbox'
                          className='custom-control-input'
                          id='customCheck1'
                        />
                        <label
                          className='custom-control-label'
                          htmlFor='customCheck1'>
                          Remember password
                        </label>
                      </div>
                      {btnLogin}
                      <hr className='my-4' />
                      <p style={{ textAlign: 'center' }}>
                        {' '}
                        Don't Have an Account?
                      </p>
                      <Link to='/register'>
                        <p style={{ textAlign: 'center' }}> Register here</p>
                      </Link>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
