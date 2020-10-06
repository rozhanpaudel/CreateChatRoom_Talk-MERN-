import React, { Component } from 'react';
import NavBarComponent from '../../navbar/navbar';
import './showhistory.css';
import axios from 'axios';
import { url } from '../../configs/config';
import { Link } from 'react-router-dom';

export default class ShowPatientHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patient_history: [],
    };
  }
  componentDidMount() {
    var patient_id = this.props.match.params.id;
    axios.get(`${url}/api/patients/patient/${patient_id}`).then((result) => {
      this.setState({ patient_history: result.data.patient_history.reverse() });
    });
  }
  render() {
    return (
      <div>
        <div className='show_patient_history'>
          <NavBarComponent />

          <Link to='/dashboard' className='btn btn-success btn-sm mt-4'>
            Go to Dashboard
          </Link>

          <div className='row'>
            {this.state.patient_history
              ? this.state.patient_history.map((patient, i) => {
                  return (
                    <div className='card my-2 mx-3' style={{ width: '18rem' }}>
                      <div className='card-body'>
                        <h5 className='card-title'>Previous Observation</h5>
                        <h6 className='card-subtitle mb-2 text-muted'>
                          Complain: {patient.complain}
                        </h6>
                        <p className='card-text'>
                          <span> Sugar : {patient.sugar}</span> <br />
                          <span> Blood Pressure : {patient.bloodpressure}</span>
                          <br />
                          <span> SPO2 : {patient.spo2}</span>
                          <br />
                          <span> Pulse : {patient.pulse}</span>
                          <br />
                          <span> BMI : {patient.bmi}</span>
                          <br />
                          <span> Weight : {patient.weight}</span>
                          <br />
                          <span> Plan : {patient.plan}</span>
                          <br />
                          <span> Observation : {patient.observation}</span>
                          <br />
                          <span>
                            {' '}
                            Last Updated : {patient.last_updated_time}
                          </span>
                          <br />
                          <span>
                            {' '}
                            Last Updated By : {patient.last_updated_by}
                          </span>
                          <br />
                          <span> Created By : {patient.created_by}</span>
                          <br />
                        </p>
                      </div>
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
