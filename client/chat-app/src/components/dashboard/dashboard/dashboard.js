import React, { Component } from 'react';
import { url } from '../../configs/config';
import './dashboard.css';
import axios from 'axios';
import NavBarComponent from '../../navbar/navbar';
import AdminDashboard from '../admindashboard/adminDashboard';
import NonVerifiedDashboard from '../nonverifieddashboard/nonverified';
import VerifiedDashboard from '../verifiedusers/verifiedUserDashboard';

export default class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = { role: '' };
  }
  componentWillMount() {
    //api call for user
    axios
      .get(`${url}/api/users/user/${localStorage.getItem('user')}`)
      .then((data) => {
        if (data.data.data.role == 3) {
          this.setState({
            role: 3,
          });
        }
        if (data.data.data.role == 2) {
          this.setState({ role: 2 });
        }
        if (data.data.data.role == 1) {
          this.setState({ role: 1 });
        }
        localStorage.setItem('email', data.data.data.email);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    console.log(this.state.role);
    //logic
    var dashboard =
      this.state.role == 1 ? (
        <AdminDashboard />
      ) : this.state.role == 2 ? (
        <VerifiedDashboard />
      ) : (
        <NonVerifiedDashboard />
      );
    return (
      <div>
        <NavBarComponent />
        <div className='dashboard_background'>
          <h2 className='pt-2 text-center'>Welcome to Dashboard</h2>{' '}
          <div className='text-center mx-auto text-white'>{dashboard}</div>
        </div>
      </div>
    );
  }
}
