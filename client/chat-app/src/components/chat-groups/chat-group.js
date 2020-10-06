import React, { Component } from 'react';
import NavBarComponent from '../navbar/navbar.js';
import axios from 'axios';
import { url } from '../configs/config';
import { Link } from 'react-router-dom';
import './chat-group.css';
import { Button } from 'semantic-ui-react';

export default class ChatGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatgroups: [],
    };
  }
  componentDidMount() {
    //fetching groups
    axios
      .get(`${url}/api/chatgroup/${localStorage.getItem('email')}`)
      .then((res) => {
        console.log(res.data.data);
        this.setState({ chatgroups: res.data.data });
      });
  }

  openGroup = (group_name) => {
    this.props.history.push(`/chatroom/${group_name}`);
  };
  render() {
    return (
      <div>
        <NavBarComponent />
        <div className='chatgroup__background loginscreen'>
          <Link to='/dashboard' className='btn btn-warning my-3 btn-sm'>
            Go Back
          </Link>
          <div className='group__items'>
            {this.state.chatgroups
              ? this.state.chatgroups.map((group, i) => {
                  return (
                    <div className='custom__card my-2 mx-2' key={i}>
                      <div className='group__chat'>
                        <h4>{group.group_name}</h4>{' '}
                      </div>

                      <button
                        onClick={() => this.openGroup(group.group_name)}
                        className='btn btn-success btn-sm'>
                        Open Group
                      </button>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    );
  }
}
