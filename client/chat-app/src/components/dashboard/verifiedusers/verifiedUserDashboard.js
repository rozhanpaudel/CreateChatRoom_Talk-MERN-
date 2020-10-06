import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

import './verifieduser.css';
import axios from 'axios';
import { url } from '../../configs/config';
import { toast } from 'react-toastify';

class VerifiedDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      group_name: '',
      isCreating: false,
      data: {},
    };
  }
  //onchange handler for create group form
  handleChange = (e) => {
    this.setState({
      group_name: e.target.value,
    });
  };

  createGroup = (e) => {
    e.preventDefault();
    this.setState({
      isCreating: true,
    });
    setTimeout(() => {
      this.setState({ isCreating: false });
      axios
        .post(`${url}/api/chatgroup/add`, {
          group_name: this.state.group_name,
          username: localStorage.getItem('email'),
        })
        .then((res) => {
          var result = JSON.stringify(res.data);
          const data = JSON.parse(result);
          console.log(data);
          toast.info(data.msg);
        })
        .catch((err) => {
          toast.info('Server Error ! Contact System Admin');
          console.log(err);
        });

      // this.props.history.push(`/chatroom/${this.state.group_name}`);
    }, 2000);
  };

  render() {
    //logic
    var createGroupBtn = this.state.isCreating ? (
      <button type='submit' className='btn btn-small btn-create-group mt-2'>
        Creating Group....
      </button>
    ) : (
      <button type='submit' className='btn btn-small btn-create-group mt-2'>
        Create Group
      </button>
    );
    return (
      <div>
        <h4 id='headverify'>Create a Group & Chat</h4>
        <p>Simpler made even more simpler</p>
        <Link to='/chat-groups' className='btn btn-danger btn-sm my-1'>
          My Groups
        </Link>
        <div id='verifydash'>
          <div class='verifieduserdashboard'>
            <form onSubmit={this.createGroup}>
              <input
                type='text'
                placeholder='Group Name'
                onChange={this.handleChange}
                className='form-control mt-1'
                required></input>
              {createGroupBtn}
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(VerifiedDashboard);
