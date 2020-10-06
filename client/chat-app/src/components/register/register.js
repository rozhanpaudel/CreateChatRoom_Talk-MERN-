import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import NavBarComponent from '../navbar/navbar';
import { upload } from '../functions/fileupload';
import { url } from '../configs/config';
import './register.css';

export default class RegisterComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRegistering: false,
      name: '',
      email: '',
      password: '',
      contact_number: '',
      qualification: '',
      dob: '',
      speciality: '',
      img: '',
      role: '3',
      confirm_password: '',
    };
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
  //handleFile
  handleFile = (e) => {
    let value = e.target.files[0];
    let name = e.target.name;
    this.setState({
      [name]: value,
    });
  };

  //Form Submit Handler
  handleSubmit = (e) => {
    e.preventDefault();
    //checking if password matches
    if (this.state.password === this.state.confirm_password) {
      this.setState({ isRegistering: true });
      var {
        name,
        email,
        password,
        contact_number,
        qualification,
        dob,
        speciality,
        role,
      } = this.state;
      var newData = {
        name,
        email,
        password,
        contact_number,
        qualification,
        dob,
        speciality,
        role,
      };

      const formData = new FormData();

      formData.append('img', this.state.img);

      for (let item in newData) {
        formData.append(item, newData[item]);
      }

      axios
        .post(`${url}/auth/register`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((data) => {
          if (data.data.msg) {
            toast.success(data.data.msg);
            this.setState({ isRegistering: false });
            this.props.history.push('/login');
          }
        });
    } else {
      toast.success('Password do not match');
    }
  };

  render() {
    //logic for registerbtn
    var btnLogin = this.state.isRegistering ? (
      <button
        className='btn btn-lg btn-primary btn-block text-uppercase mt-3'
        type='submit'>
        Loading...
      </button>
    ) : (
      <button
        className='btn btn-lg btn-primary btn-block text-uppercase mt-3'
        type='submit'>
        Register
      </button>
    );

    return (
      <div>
        <NavBarComponent />
        <div className='login_background my-0 py-0'>
          <div className='container'>
            <div className='row'>
              <div className='col-sm-9 col-md-8 col-lg-8 mx-auto'>
                <div className='card card-signin my-5'>
                  <div className='card-body'>
                    <h5 className='card-title text-center'>Registration</h5>

                    <form className='form-signin' onSubmit={this.handleSubmit}>
                      <div className='row'>
                        <div className='col-6'>
                          <div className='form-label-group'>
                            <label htmlFor='name'>Name</label>
                            <input
                              type='text'
                              id='name'
                              name='name'
                              onChange={this.handleChange}
                              className='form-control'
                              placeholder='Full Name'
                              required
                              autofocus
                            />
                          </div>
                          <div className='form-label-group'>
                            <label htmlFor='email'>Email Address</label>
                            <input
                              type='email'
                              id='email'
                              name='email'
                              onChange={this.handleChange}
                              className='form-control'
                              placeholder='Email Address'
                              required
                            />
                          </div>
                          <div className='form-label-group'>
                            <label htmlFor='inputPassword'>Password</label>
                            <input
                              type='password'
                              name='password'
                              onChange={this.handleChange}
                              id='inputPassword'
                              className='form-control'
                              placeholder='Password'
                              required
                            />
                          </div>
                          <div className='form-label-group'>
                            <label htmlFor='inputPassword'>
                              Confirm Password
                            </label>
                            <input
                              type='password'
                              name='confirm_password'
                              onChange={this.handleChange}
                              id='inputPassword'
                              className='form-control'
                              placeholder='Confirm-Password'
                              required
                            />
                          </div>
                          <div className='form-label-group'>
                            <label htmlFor='number'>Contact Number</label>
                            <input
                              type='number'
                              id='number'
                              onChange={this.handleChange}
                              name='contact_number'
                              className='form-control'
                              placeholder='Contact Number'
                              required
                            />
                          </div>
                        </div>
                        <div className='col-6'>
                          <div className='form-label-group'>
                            <label htmlFor='qualification'>
                              {' '}
                              Educational Qualification
                            </label>
                            <input
                              type='text'
                              id='qualification'
                              name='qualification'
                              onChange={this.handleChange}
                              className='form-control'
                              placeholder='MBBS'
                              required
                              autofocus
                            />
                          </div>
                          <div className='form-label-group'>
                            <label htmlFor='dob'>Date of Birth (A.D.)</label>
                            <input
                              type='date'
                              id='dob'
                              name='dob'
                              onChange={this.handleChange}
                              className='form-control'
                              placeholder='Date Of Birth'
                              required
                            />
                          </div>

                          <div className='form-label-group'>
                            <label htmlFor='speciality'>Speciality</label>
                            <select
                              className='form-control'
                              required={true}
                              onChange={this.handleChange}
                              name='speciality'
                              id='speciality'>
                              <option value=''>Select Speciality</option>
                              <option value='Dermatologist'>
                                Dermatologist{' '}
                              </option>
                              <option value='Pathology'>Pathology</option>
                              <option value='Oncology'>Oncology</option>
                              <option value='Pediatrics'>Pediatrics</option>
                            </select>
                          </div>
                          <div className='form-label-group'>
                            <label htmlFor='image'>Image </label>
                            <input
                              type='file'
                              id='image'
                              name='img'
                              onChange={this.handleFile}
                              className='form-control'
                              placeholder='Image'
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {btnLogin}
                      <hr className='my-4' />
                      <p style={{ textAlign: 'center' }}>
                        {' '}
                        Already have an Account?
                      </p>
                      <Link to='/login'>
                        <p style={{ textAlign: 'center' }}> Login here</p>
                      </Link>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
