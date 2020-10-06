import React, { Component } from 'react';
import NavBarComponent from '../../navbar/navbar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { url } from '../../configs/config';
import { toast } from 'react-toastify';
import './edit.css';

//connection
const socket = io.connect(url, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
});
export default class EditPatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patient_bed_no: '',
      sugar: '',
      bloodpressure: '',
      spo2: '',
      bmi: '',
      weight: '',
      pulse: '',
      complain: '',
      observation: '',
      plan: '',
      last_updated_time: '',
      last_updated_by: '',
      fromRoom: '',
      loggedInUSer: '',
      patient_id: '',
      previous_vitals: {}, //If user updates the patient this will be the previous Vital
      isSubmitted: false,
      prev_prev_vitals: {}, // previous vitals of patients used to display
    };
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  componentDidMount() {
    var paramsArray = this.props.match.params.id.split('_');

    var patient_id = paramsArray[0];

    this.setState({ fromRoom: paramsArray[1], patient_id: paramsArray[0] });
    //fetching the loggedin user
    axios
      .get(`${url}/api/users/user/${localStorage.getItem('user')}`)
      .then((result) => {
        this.setState({ loggedInUSer: result.data.data.name });
      });
    //fetching the name of the user
    axios
      .get(`${url}/api/users/user/${localStorage.getItem('user')}`)
      .then((result) => {
        console.log('result is ', result.data.data.name);
        this.setState({ last_updated_by: result.data.data.name });
      });

    //fetching the patient information
    axios.get(`${url}/api/patients/patient/${patient_id}`).then((result) => {
      var prev_Vitals = {
        sugar: result.data.sugar,
        bloodpressure: result.data.bloodpressure,
        spo2: result.data.spo2,
        bmi: result.data.bmi,
        weight: result.data.weight,
        pulse: result.data.pulse,
        complain: result.data.complain,
        observation: result.data.observation,
        plan: result.data.plan,
        created_by: result.data.created_by,
        last_updated_by: result.data.last_updated_by,
        last_updated_time: result.data.last_updated_time,
      };
      this.setState({
        patient_bed_no: result.data.patient_bed_no,
        sugar: result.data.sugar,
        bloodpressure: result.data.bloodpressure,
        spo2: result.data.spo2,
        bmi: result.data.bmi,
        weight: result.data.weight,
        pulse: result.data.pulse,
        complain: result.data.complain,
        observation: result.data.observation,
        plan: result.data.plan,
        previous_vitals: prev_Vitals,
        created_by: result.data.created_by,
        prev_prev_vitals: result.data.previous_vitals,
      });
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      sugar,
      bmi,
      spo2,
      weight,
      bloodpressure,
      pulse,
      complain,
      plan,
      observation,
      last_updated_by,
      previous_vitals,
    } = this.state;
    var newData = {
      sugar,
      bmi,
      spo2,
      weight,
      bloodpressure,
      pulse,
      complain,
      plan,
      observation,
      last_updated_by,
      previous_vitals,
    };
    //api call
    axios
      .put(`${url}/api/patients/patient/${this.state.patient_id}`, newData)
      .then((result) => {
        console.log(result.data.msg);
        toast.success(result.data.msg);
        if (result.data.data) {
          //patient update notification
          socket.emit('patientNotification', {
            patient_bed_no: this.state.patient_bed_no,
            room: this.state.fromRoom,
            last_updated_by: this.state.loggedInUSer,
          });
          this.setState({ isSubmitted: true });
        }
      });
  };
  render() {
    //logic
    var EditItemLogic = this.state.isSubmitted ? (
      <div className='patientEdit_success'>
        <h2 className='text-center text-white pt-5'>Updated ! </h2>{' '}
        <Link className='btn btn-success btn-sm' to='/dashboard'>
          Go to dashboard
        </Link>
      </div>
    ) : (
      <div className='login_background my-0 py-0'>
        <div className='container'>
          <Link to='/dashboard' className='btn btn-success btn-sm mt-4'>
            Go to Dashboard
          </Link>
          {/* card to display previous Vitals */}
          <div className='card previous_vitals_card' style={{ width: '18rem' }}>
            <div className='card-body'>
              <h5 className='card-title'>Previous Observation</h5>
              <h6 className='card-subtitle mb-2 text-muted'>
                Complain :{' '}
                {this.state.prev_prev_vitals
                  ? this.state.prev_prev_vitals.complain
                  : null}
              </h6>
              <p className='card-text'>
                {this.state.prev_prev_vitals ? (
                  <div>
                    {' '}
                    <span>
                      {' '}
                      Sugar : {this.state.prev_prev_vitals.sugar}
                    </span>{' '}
                    <br />
                    <span>
                      {' '}
                      Blood Pressure :{' '}
                      {this.state.prev_prev_vitals.bloodpressure}
                    </span>
                    <br />
                    <span> SPO2 : {this.state.prev_prev_vitals.spo2}</span>
                    <br />
                    <span> Pulse : {this.state.prev_prev_vitals.pulse}</span>
                    <br />
                    <span> BMI : {this.state.prev_prev_vitals.bmi}</span>
                    <br />
                    <span> Weight : {this.state.prev_prev_vitals.weight}</span>
                    <br />
                    <span> Plan : {this.state.prev_prev_vitals.plan}</span>
                    <br />
                    <span>
                      {' '}
                      Observation : {this.state.prev_prev_vitals.observation}
                    </span>
                    <br />
                    <span>
                      {' '}
                      Last Updated :{' '}
                      {this.state.prev_prev_vitals.last_updated_time}
                    </span>
                    <br />
                    <span>
                      {' '}
                      Last Updated By :{' '}
                      {this.state.prev_prev_vitals.last_updated_by}
                    </span>
                    <br />
                    <span>
                      {' '}
                      Created By : {this.state.prev_prev_vitals.created_by}
                    </span>
                    <br />
                    <Link
                      to={`/patient/history/${this.state.patient_id}`}
                      class='card-link'>
                      Show History
                    </Link>
                  </div>
                ) : null}
              </p>
            </div>
          </div>
          {/* card to display previous Vitals */}
          <div className='row'>
            <div className='col-sm-9 col-md-8 col-lg-8 mx-auto'>
              <div className='card card-signin my-5'>
                <div className='card-body'>
                  <h5 className='card-title text-center'>
                    Edit Patient (Created by : {this.state.created_by} )
                  </h5>

                  <form className='form-signin' onSubmit={this.handleSubmit}>
                    <div className='row'>
                      <div className='col-6'>
                        <div className='form-label-group'>
                          <label htmlFor='bed'>Patient Bed No</label>
                          <input
                            type='text'
                            id='bed'
                            name='patient_bed_no'
                            defaultValue={this.state.patient_bed_no}
                            className='form-control'
                            placeholder='Bed Number'
                            required
                            autofocus
                          />
                        </div>
                        <h5 className='card-title text-center'>Vitals</h5>
                        <div className='form-label-group'>
                          <label htmlFor='sugar'>Sugar</label>
                          <input
                            type='sugar'
                            id='sugar'
                            name='sugar'
                            value={this.state.sugar}
                            onChange={this.handleChange}
                            className='form-control'
                            placeholder='Sugar'
                          />
                        </div>
                        <div className='form-label-group'>
                          <label htmlFor='bloodpressure'>Blood Pressure</label>
                          <input
                            type='text'
                            name='bloodpressure'
                            onChange={this.handleChange}
                            value={this.state.bloodpressure}
                            id='bloodpressure'
                            className='form-control'
                            placeholder='Blood Pressure'
                          />
                        </div>
                        <div className='form-label-group'>
                          <label htmlFor='inputPassword'>SPO2</label>
                          <input
                            type='text'
                            name='spo2'
                            value={this.state.spo2}
                            onChange={this.handleChange}
                            id='inputPassword'
                            className='form-control'
                            placeholder='SPO2'
                          />
                        </div>
                        <div className='form-label-group'>
                          <label htmlFor='bmi'>BMI</label>
                          <input
                            type='text'
                            id='bmi'
                            value={this.state.bmi}
                            onChange={this.handleChange}
                            name='bmi'
                            className='form-control'
                            placeholder='BMI'
                          />
                        </div>
                      </div>
                      <div className='col-6'>
                        <div className='form-label-group'>
                          <label htmlFor='weight'> Weight</label>
                          <input
                            type='text'
                            value={this.state.weight}
                            id='weight'
                            name='weight'
                            onChange={this.handleChange}
                            className='form-control'
                            placeholder='Weight in KG'
                            autofocus
                          />
                        </div>
                        <div className='form-label-group'>
                          <label htmlFor='pulse'>Pulse</label>
                          <input
                            type='text'
                            id='pulse'
                            value={this.state.pulse}
                            name='pulse'
                            onChange={this.handleChange}
                            className='form-control'
                            placeholder='Pulse Rate'
                          />
                        </div>
                        <h5 className='card-title text-center'>Reports</h5>
                        <div className='form-label-group'>
                          <label htmlFor='complain'>Complain</label>
                          <textarea
                            className='form-control'
                            onChange={this.handleChange}
                            value={this.state.complain}
                            name='complain'
                            id='complain'
                          />
                        </div>
                        <div className='form-label-group'>
                          <label htmlFor='observation'>Observation</label>
                          <textarea
                            className='form-control'
                            value={this.state.observation}
                            onChange={this.handleChange}
                            name='observation'
                            id='observation'
                          />
                        </div>
                        <div className='form-label-group'>
                          <label htmlFor='plan'>Plan</label>
                          <textarea
                            className='form-control'
                            value={this.state.plan}
                            onChange={this.handleChange}
                            name='plan'
                            id='plan'
                          />
                        </div>
                      </div>
                    </div>

                    <hr className='my-4' />
                    <button
                      type='submit'
                      className='btn btn-warning btn-sm ml-auto mr-auto '>
                      Update
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    return (
      <div>
        <NavBarComponent />
        {EditItemLogic}
      </div>
    );
  }
}
