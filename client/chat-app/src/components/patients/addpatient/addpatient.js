import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import NavBarComponent from '../../navbar/navbar';
import { url } from '../../configs/config';

export default class AddPatient extends Component {
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
      created_by: '',
      isSubmitted: false,
    };
  }

  componentDidMount() {
    axios
      .get(`${url}/api/users/user/${localStorage.getItem('user')}`)
      .then((result) => {
        console.log('result is ', result.data.data.name);
        this.setState({ created_by: result.data.data.name });
      });
  }

  //onchange handler
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
    const {
      patient_bed_no,
      sugar,
      pulse,
      bloodpressure,
      bmi,
      spo2,
      weight,
      complain,
      observation,
      plan,
      created_by,
    } = this.state;
    var newData = {
      patient_bed_no,
      sugar,
      pulse,
      bloodpressure,
      bmi,
      spo2,
      weight,
      complain,
      observation,
      plan,
      created_by,
    };
    axios.post(`${url}/api/patients/create`, newData).then((result) => {
      toast.info(result.data.msg.toString());
      if (result.data.data) this.setState({ isSubmitted: true });
    });
  };
  render() {
    //logic
    var PatientFormInfo = this.state.isSubmitted ? (
      <div>
        {' '}
        <h4 className='text-center'>Your form is Submitted ! </h4>
      </div>
    ) : (
      <div className='login_background my-0 py-0'>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-9 col-md-8 col-lg-8 mx-auto'>
              <div className='card card-signin my-5'>
                <div className='card-body'>
                  <h5 className='card-title text-center'>Add Patient</h5>

                  <form className='form-signin' onSubmit={this.handleSubmit}>
                    <div className='row'>
                      <div className='col-6'>
                        <div className='form-label-group'>
                          <label htmlFor='bed'>Patient Bed No</label>
                          <input
                            type='text'
                            id='bed'
                            name='patient_bed_no'
                            onChange={this.handleChange}
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
                            required={true}
                            onChange={this.handleChange}
                            name='complain'
                            id='complain'
                          />
                        </div>
                        <div className='form-label-group'>
                          <label htmlFor='observation'>Observation</label>
                          <textarea
                            className='form-control'
                            required={true}
                            onChange={this.handleChange}
                            name='observation'
                            id='observation'
                          />
                        </div>
                        <div className='form-label-group'>
                          <label htmlFor='plan'>Plan</label>
                          <textarea
                            className='form-control'
                            required={true}
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
                      Create
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
        {PatientFormInfo}
      </div>
    );
  }
}
