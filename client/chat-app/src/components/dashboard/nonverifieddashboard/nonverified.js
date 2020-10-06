import React, { Component } from 'react';

export default class NonVerifiedDashboard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div className='dashboard_background'>
          <div className='text-center mx-auto text-white'>
            <p>Your account is not yet verified . Please come back soon </p>
          </div>
        </div>
      </div>
    );
  }
}
