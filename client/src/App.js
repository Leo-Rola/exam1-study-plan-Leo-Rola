import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Container, Row, Alert, Toast, Button, ToastContainer } from 'react-bootstrap';

import MessageContext from './messageCtx';
import { CourseView } from './Views/CourseView';
import { LoginView } from './Views/LoginView';
import { EditView } from './Views/EditView';
import { MyNavbar } from './Components/MyNavbar';
import API from './API';


function App() {

  const [messageErr, setMessageErr] = useState('');
  const handleErrors = (err) => {
    let msg = '';
    if (err.error) msg = err.error;
    else if (String(err) === "string") msg = String(err);
    else msg = "Unknown Error";
    setMessageErr(msg);
  }

  return (
    <BrowserRouter>
      <MessageContext.Provider value={{ handleErrors }}>
        <Container fluid className='App'>
          <Routes>
            <Route path="/*" element={<Main />} />
          </Routes>
          <ToastContainer className='mt-1' position='top-center'>
            <Toast bg='danger text-light' show={messageErr !== ''} onClose={() => setMessageErr('')} delay={4000} autohide>
              <Toast.Body>{messageErr}</Toast.Body>
            </Toast></ToastContainer>
        </Container>
      </MessageContext.Provider>
    </BrowserRouter>
  )
}


function Main() {
  const { handleErrors } = useContext(MessageContext);

  const [courses, setCourses] = useState([]);
  const [studyPlan, setStudyPlan] = useState([]);
  const [diffCourses, setDiffCourses] = useState([]);
  const handleStudyPlan = (studyPlanBis) => {
    setStudyPlan(studyPlanBis);
  };

  const handleDiffCourses = (diffCoursesBis) => {
    setDiffCourses(diffCoursesBis);
  };

  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({});
  const handleUser = (fullTime) => {
    setUser(user => { return { id: user.id, username: user.username, name: user.name, surname: user.surname, fullTime: fullTime } });
  }
    ;
  const handleLogin = (credentials) => {
    API.logIn(credentials).then(user => {
      setUser(user);
      setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' });
      setLoggedIn(true);

    }).catch(err => {
      setMessage({ msg: err, type: 'danger' });
    })
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setUser({});
    setStudyPlan([]);
    setDiffCourses([]);
    setMessage('');

  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo(); // we have the user info here
        setUser(user);
        setLoggedIn(true);
      } catch (err) { if (loggedIn) { handleErrors(err); } }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const getStudyPlanDiffCourses = async () => {
      try {
        const studyPlan = await API.getStudyPlan();
        setStudyPlan(studyPlan);
        const diffCourses = await API.getDiffCourses();
        setDiffCourses(diffCourses);
      } catch (err) { if (loggedIn) { handleErrors(err); } }
    };
    getStudyPlanDiffCourses();
  }, [loggedIn, user]);


  useEffect(() => {
    const getCourses = async () => {
      await API.getCourses().then((courses) => setCourses(courses)).catch(err => handleErrors(err));
    };
    getCourses();
  }, [user]);


  return (
    <>
      {message && <Row>
        <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
      </Row>}
      <MyNavbar user={user} loggedIn={loggedIn} logout={handleLogout} />
      <Routes>
        <Route path='/' element={<CourseView user={user} courses={courses} studyPlan={studyPlan} loggedIn={loggedIn} handleStudyPlan={handleStudyPlan} handleDiffCourses={handleDiffCourses} handleUser={handleUser} />}></Route>
        <Route path='/login' element={loggedIn ? <Navigate replace to='/' /> : <LoginView login={handleLogin} user={user} loggedIn={loggedIn} />}></Route>
        <Route path='/add' element={!loggedIn ? <Navigate replace to='/login' /> : <EditView user={user} courses={courses} studyPlan={studyPlan} diffCourses={diffCourses} handleStudyPlan={handleStudyPlan} handleDiffCourses={handleDiffCourses} handleUser={handleUser} />}></Route>
        <Route path='/edit' element={!loggedIn ? <Navigate replace to='/login' /> : <EditView user={user} courses={courses} studyPlan={studyPlan} diffCourses={diffCourses} handleStudyPlan={handleStudyPlan} handleDiffCourses={handleDiffCourses} handleUser={handleUser} />}></Route>
        <Route path='*' element={<div className='mt-5 '><h1>This is not the route you are looking for!</h1>
          <Link to="/"><Button className='mt-3' variant="dark">Go Home!</Button></Link>
        </div>}></Route>
      </Routes>
    </>
  );
}

export default App;