import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import './admin.css';
import axios from 'axios';
import { url } from '../../configs/config';

class AdminDashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unverified_users: [],
    };
  }
  componentDidMount() {
    //api call for list of users
    axios.get(`${url}/api/users`).then((data) => {
      const userslist = data.data.data;
      const filtered = userslist.filter((user, id) => {
        if (user.role == 3) return user;
      });
      this.setState({ unverified_users: filtered });
    });
  }

  //activate user by changing its role to 2 from 3
  activateUser = (id, i) => {
    //change user role
    axios.post(`${url}/api/users/acceptuser/${id}`).then((data) => {
      toast.success('User Verified !');
      var { unverified_users } = this.state;
      //removing this user from list of unverified user
      unverified_users.splice(i, 1);
      this.setState({ unverified_users: unverified_users });
    });
  };

  render() {
    return (
      <div>
        <h4>Admin Dashboard</h4>
        <div className='container adminpanel'>
          <h6>List of unverified users</h6>
          {this.state.unverified_users.map((user, i) => {
            return (
              <div id={i}>
                <div
                  className='card pt-1 custom_card_style'
                  style={{ width: '14rem' }}>
                  <img
                    className='bd-placeholder-img card-img-top'
                    width='100%'
                    src={user.img}
                    height={180}></img>
                  <h5>{user.name}</h5>
                  <h6>Qualification: </h6> <span> {user.qualification}</span>{' '}
                  <br />
                  <h6>Email: </h6>
                  <span> {user.email}</span> <br />
                  <h6>Contact Number: </h6>
                  <span> {user.contact_number}</span> <br />
                  <button
                    onClick={() => this.activateUser(user._id, i)}
                    className='btn btn-primary mt-1 btn-sm'>
                    Activate this user
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
export default withRouter(AdminDashBoard);
