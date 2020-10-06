import React, { Component } from 'react';
import axios from 'axios';
import Popup from 'reactjs-popup';
import { url } from '../../configs/config';
import { toast } from 'react-toastify';
import EditPatient from '../editPatients/editpatient';
import { Link } from 'react-router-dom';

export default class ShowPatients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patients: [],
    };
  }
  componentDidMount() {
    //fetching all the patients
    axios.get(`${url}/api/patients/all`).then((result) => {
      this.setState({ patients: result.data.data });
    });
  }
  componentDidUpdate() {
    //fetching all the patients
    axios.get(`${url}/api/patients/all`).then((result) => {
      this.setState({ patients: result.data.data });
    });
  }

  handleDelete = (id) => {
    axios.delete(`${url}/api/patients/patient/${id}`).then((result) => {
      console.log(result.data.msg);
      toast.success(result.data.msg);
    });
  };

  render() {
    return (
      <div className='patients_modal text-center'>
        <table class='table'>
          <thead class='thead-dark'>
            <tr>
              <th scope='col'>Bed No:</th>
              <th scope='col'>Last Updated Date:</th>
              <th scope='col'>Last Updated by:</th>
              <th scope='col'>Actions:</th>
            </tr>
          </thead>

          {this.state.patients.map((patient, i) => {
            return (
              <tbody>
                <tr>
                  <th scope='row'>{patient.patient_bed_no}</th>
                  <td>{patient.last_updated_time}</td>
                  <td>{patient.last_updated_by}</td>
                  <td>
                    <Link
                      to={`/edit/patient/${patient._id}_${this.props.room}`}
                      target='_blank'
                      className='btn btn-primary btn-sm'>
                      View/Edit
                    </Link>{' '}
                    <button
                      onClick={() => this.handleDelete(patient._id)}
                      className='btn btn-danger btn-sm'>
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
    );
  }
}
