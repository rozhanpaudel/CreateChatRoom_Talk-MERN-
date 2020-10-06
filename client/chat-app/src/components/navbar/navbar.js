import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import './navbar.css';

class NavBarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
    };
  }
  componentWillMount() {
    if (localStorage.getItem('token')) {
      this.setState({
        isLoggedIn: true,
      });
    } else {
      this.setState({ isLoggedIn: false });
    }
  }
  handleLogout = () => {
    //delete token
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    toast.info('Logged Out');
    this.props.history.push('/');
  };
  render() {
    var list = this.state.isLoggedIn ? (
      <div className='collapse navbar-collapse' id='navbarSupportedContent'>
        <ul className='navbar-nav ml-auto dropdown_profile '>
          {/* Dropdown */}
          <div class='dropdown '>
            <li
              class='btn dropdown-toggle text-white'
              id='dropdownMenu2'
              data-toggle='dropdown'
              aria-haspopup='true'
              aria-expanded='false'>
              <i class='fas fa-user-circle text-white'></i>
            </li>
            <div
              class='dropdown-menu navbar_dropdown_size'
              aria-labelledby='dropdownMenu2'>
              <li class='dropdown-item'>Profile</li>
              <li class='dropdown-item'>Users</li>
              <li
                class='dropdown-item'
                id='logout_onhover'
                onClick={this.handleLogout}>
                {' '}
                <i class='fas fa-sign-out-alt'></i> Logout{' '}
              </li>
            </div>
          </div>
        </ul>
      </div>
    ) : (
      <div className='collapse navbar-collapse' id='navbarSupportedContent'>
        <ul className='navbar-nav ml-auto '>
          <li className='nav-item'>
            <Link className='nav-link px-3 text-white' to='/login'>
              <i class='fas fa-sign-in-alt fa-sm'> Login</i>
            </Link>
          </li>

          <li className='nav-item'>
            <Link className='nav-link px-3 text-white' to='/register'>
              <i class='fas fa-registered fa-sm'> Register</i>
            </Link>
          </li>
        </ul>
      </div>
    );
    return (
      <div>
        <nav className='navbar navbar-expand-md navbar-dark bg-dark my-0 py-0'>
          <img
            className='navbar-brand'
            style={{ width: '50px', height: '50px' }}
            src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Internet-group-chat.svg/1024px-Internet-group-chat.svg.png'
            Brand
            Image
          />
          <button
            className='navbar-toggler '
            type='button'
            data-toggle='collapse'
            data-target='#navbarSupportedContent'
            aria-controls='navbarSupportedContent'
            aria-expanded='false'
            aria-label='Toggle navigation'>
            <span className='navbar-toggler-icon' />
          </button>
          {list}
        </nav>
      </div>
    );
  }
}
export default withRouter(NavBarComponent);
