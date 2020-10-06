import React, { Component } from 'react';
import NavBarComponent from '../navbar/navbar';
import { Link } from 'react-router-dom';
import ScrollToBottom from 'react-scroll-to-bottom';
import { toast } from 'react-toastify';
import Popup from 'reactjs-popup';
import io from 'socket.io-client';
import { url } from '../configs/config';

import './chatroom.css';
import axios from 'axios';

import ImageSelect from '../imageSelect/imageSelect';
import ShowPatients from '../patients/showPatients/showpatients';

//connection
var socket;
var options = [];

export default class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      current_msg: '',
      messages: [],
      username: '',
      rooms: [],
      users: [],
      added_users: [],
      group_users: [],
      onlineUsers: [],
      selected_user: null,
      isconnected: false,
    };
    socket = io.connect(url, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    });
  }

  //perform emit and listen
  componentDidMount() {
    this.scrollToBottom();

    socket.on('connect', () => {
      if (socket.connected === false)
        this.setState({ isconnected: !this.state.isconnected });
    });

    axios
      .get(`${url}/api/users/user/${localStorage.getItem('user')}`)
      .then((data) => {
        const newuser = data.data.data;

        this.setState(
          {
            user: newuser,
          },
          () => {}
        );
      });
    //fetching all users
    axios.get(`${url}/api/users`).then((users) => {
      const verified_users = users.data.data.filter((user) => {
        return user.role === 2;
      });
      this.setState({
        users: verified_users,
      });
      //creating object
      console.log('verified users', verified_users);

      verified_users.forEach((element) => {
        var userOption = {
          name: element.name,
          image: element.img,
          qualification: element.qualification,
          email: element.email,
        };
        if (options.indexOf(userOption) == -1) options.push(userOption);
      });
    });

    //fetching group details
    axios
      .get(`${url}/api/chatgroup/group/${this.props.match.params.id}`)
      .then((result) => {
        this.setState({
          added_users: result.data.data.users,
          messages: [...this.state.messages, ...result.data.data.messages],
        });
      });
    const room = this.props.match.params.id;
    const username = localStorage.getItem('email');

    // Join chatroom
    socket.emit('joinRoom', {
      username: username,
      room: room,
    });

    //Message for access
    socket.on('custom_msg', (msg) => {
      toast.info(msg);
      console.log(msg);
      this.props.history.push('/dashboard');
    });

    // Get room and users
    socket.on('roomUsers', ({ room, users }) => {
      var roomandusers = { room: room, users: users };
      this.setState({
        rooms: roomandusers,
      });

      this.setState({
        group_users: [
          ...this.mapGroupUsersToVerified(
            this.state.users,
            this.state.added_users
          ),
        ],
        onlineUsers: [
          ...this.mapOnlineUsersToVerified(
            this.state.users,
            this.state.rooms.users
          ),
        ],
      });
    });

    // Message from server
    socket.on('message', (message) => {
      this.setState({
        messages: [...this.state.messages, message],
      });
    });
  }

  //getting online users details
  mapGroupUsersToVerified = (data1, data2) => {
    var group_users_name = [];
    data1.forEach((element1) => {
      data2.forEach((element2) => {
        if (element1.email == element2) group_users_name.push(element1);
      });
    });

    return group_users_name;
  };

  mapOnlineUsersToVerified = (data1, data2) => {
    var group_users_name = [];
    data1.forEach((element1) => {
      data2.forEach((element2) => {
        if (element1.email == element2.username)
          group_users_name.push(element1);
      });
    });

    return group_users_name;
  };

  refreshPage() {
    window.location.reload(true);
  }

  //forImageSelect
  handleImageSelect = (obj) => {
    this.setState({ selected_user: obj });
  };

  componentWillUnmount() {
    socket.disconnect();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.el.scrollIntoView({ behavior: 'smooth' });
  }

  //onchange handler for currentmsg
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  //hanlder for send button
  sendMessage = (e) => {
    e.preventDefault();
    if (socket.connected) {
      // Emit message to server

      socket.emit('chatMessage', this.state.current_msg);
      this.setState({
        current_msg: '',
      });
      return true;
    } else {
      //handle
      toast.info('You are offline');
    }
  };

  //add user to chat room
  addUser = (e) => {
    e.preventDefault();
    if (this.state.selected_user !== null) {
      console.log('selected user', this.state.selected_user);

      //make api call
      axios
        .put(`${url}/api/chatgroup/add`, {
          group_name: this.props.match.params.id,
          user: this.state.selected_user.email,
        })
        .then((result) => {
          toast.info(result.data.msg);
          this.setState({
            selected_user: null,
          });
        });
      this.setState({
        group_users: [...this.state.group_users, this.state.selected_user],
      });
    } else {
      toast.warn('You havenot selected any user');
    }
  };

  render() {
    //logic
    var users = this.state.onlineUsers
      ? this.state.onlineUsers.map((user, i) => {
          return (
            <div id={i}>
              {' '}
              <span>
                <img
                  style={{
                    height: '35px',
                    width: '35px',
                    borderRadius: '50%',
                    marginRight: '5px',
                    marginBottom: '5px',
                  }}
                  src={user.img}
                />
                {user.name} ({user.qualification})
              </span>
            </div>
          );
        })
      : null;

    var reconnect_btn = socket.connected ? (
      <div>
        {' '}
        <span>Hurray ! Connected</span>
      </div>
    ) : (
      <div>
        <span>Connecting...</span>
      </div>
    );

    return (
      <div className='dashboard_background_chatroom'>
        <NavBarComponent />
        <div className='chat-container'>
          <header className='chat-header'>
            <h1>Messenger</h1>
            {/* <button
              className='btn btn-primary btn-sm'
              onClick={this.refreshPage}>
              Refresh Page
            </button> */}
            {reconnect_btn}

            <div className='patients_modal'>
              {/* Button trigger modal */}
              <button
                type='button'
                className='btn btn-primary btn-sm mr-1'
                data-toggle='modal'
                data-target='#exampleModal'>
                Patients
              </button>
              {/* Modal */}
              <div
                className='modal fade'
                id='exampleModal'
                tabIndex={-1}
                role='dialog'
                aria-labelledby='exampleModalLabel'
                aria-hidden='true'>
                <div className='modal-dialog' role='document'>
                  <div className='modal-content'>
                    <div className='modal-header'>
                      <h5 className='modal-title' id='exampleModalLabel'>
                        Patients
                      </h5>
                      <button
                        type='button'
                        className='close'
                        data-dismiss='modal'
                        aria-label='Close'>
                        <span aria-hidden='true'>×</span>
                      </button>
                    </div>
                    <div className='modal-body'>
                      {/* another model here */}
                      <div id='create_patient ' className='text-center'>
                        <i class='fas fa-plus'>
                          {' '}
                          <Link to='/add-patient' target='_blank'>
                            Create{' '}
                          </Link>
                        </i>
                      </div>
                      <div style={{ overflowY: 'scroll', height: '15em' }}>
                        <ShowPatients room={this.props.match.params.id} />
                      </div>
                    </div>
                    <div className='modal-footer'>
                      <button
                        type='button'
                        className='btn btn-secondary'
                        data-dismiss='modal'>
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <Link to='/dashboard' className='btn btn-success btn-sm'>
                Leave Room
              </Link>
            </div>
          </header>

          <main className='chat-main'>
            <div className='chat-sidebar'>
              <h3>
                <i className='fas fa-comments' /> Room Name:
              </h3>

              <h2 id='room-name'>{this.state.rooms.room}</h2>

              <div className='group__members'>
                <h4>Group Members</h4>

                <ImageSelect
                  handleImageSelect={this.handleImageSelect}
                  options={options}
                  clear={this.state.clear}
                />
                <button
                  className='btn btn-warning btn-sm my-1'
                  onClick={this.addUser}>
                  Add User to Group
                </button>
                <div className='group__scroll__box'>
                  {this.state.group_users
                    ? this.state.group_users.map((user, i) => {
                        return (
                          <div key={i} className='mr-5 '>
                            {' '}
                            <img
                              style={{
                                height: '35px',
                                width: '35px',
                                borderRadius: '50%',
                              }}
                              src={user.img}
                            />
                            <span> {user.name}</span> <br />({user.email})
                          </div>
                        );
                      })
                    : null}
                </div>
              </div>
              <h3>
                <i className='fas fa-users' />
                Online Users
              </h3>
              <div className='group__scroll__box'>
                <ul id='users'> {users}</ul>
              </div>
            </div>

            <div className='chat-messages'>
              {this.state.messages.map((msg, i) => {
                return (
                  <div className='message'>
                    <p className='meta'>
                      {msg.username} <span>{msg.time}</span>
                    </p>
                    <p className='text'>{msg.text}</p>
                  </div>
                );
              })}
              <div
                ref={(el) => {
                  this.el = el;
                }}
              />
            </div>
          </main>
          <div className='chat-form-container'>
            <form id='chat-form' onSubmit={this.sendMessage}>
              <input
                id='msg'
                type='text'
                onChange={this.handleChange}
                name='current_msg'
                placeholder='Enter Message'
                value={this.state.current_msg}
                required={true}
                autoComplete='off'
              />
              <button type='submit' className='btn btn-success btn-sm'>
                <i className='fas fa-paper-plane' /> Send
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
