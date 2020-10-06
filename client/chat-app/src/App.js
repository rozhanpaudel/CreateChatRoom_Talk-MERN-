import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginComponent from './components/login/login';
import RegisterComponent from './components/register/register';
import NotFound from './components/notfound/notfound';
import NavBarComponent from './components/navbar/navbar';
import DashBoard from './components/dashboard/dashboard/dashboard';
import ChatRoom from './components/chatroom/chatroom';
import ChatGroup from './components/chat-groups/chat-group';
import AddPatient from './components/patients/addpatient/addpatient';
import EditPatient from './components/patients/editPatients/editpatient';
import ShowPatientHistory from './components/patients/showHistory/showHistory';

// Protected Route
const ProtectedRoute = ({ component: Component, ...props }) => {
  return (
    <Route
      {...props}
      render={
        (props) =>
          localStorage.getItem('token') ? (
            <>
              <Component {...props}></Component>
            </>
          ) : (
            <Redirect to='/'></Redirect>
          ) // TODO send props
      }
    />
  );
};

function App() {
  return (
    <div className='App'>
      <ToastContainer
        position='top-right'
        autoClose={1300}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
      />
      <Router>
        <Switch>
          <Route path='/' exact component={LoginComponent} />
          <Route path='/login' exact component={LoginComponent} />
          <Route path='/register' component={RegisterComponent} />
          <ProtectedRoute path='/chat-groups' component={ChatGroup} />
          <ProtectedRoute path='/dashboard' component={DashBoard} />
          <ProtectedRoute path='/add-patient' component={AddPatient} />
          <ProtectedRoute path='/edit/patient/:id' component={EditPatient} />
          <ProtectedRoute path='/chatroom/:id' component={ChatRoom} />
          <ProtectedRoute
            path='/patient/history/:id'
            component={ShowPatientHistory}
          />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
