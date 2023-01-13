import { Button, Spinner } from 'react-bootstrap';
import { Link, } from 'react-router-dom';
import React, { useState, useContext } from 'react';

import MessageContext from '../messageCtx';
import { MyCourseTable } from '../Components/MyCourseTable';
import { MyAddStudyPlan } from '../Components/MyAddStudyPlan';
import API from '../API';

function CourseView(props) {
    const { handleErrors } = useContext(MessageContext);
    const [loading1, setLoading1] = useState(false);

    const deleteStudyPlan = async () => {
        try {
            setLoading1(true);
            await API.changeNumberofEnrolledStudents(-1);
            await API.deleteStudyPlan();
            await API.updateEnrollmentOption(null);
            props.handleUser(null);
            props.handleStudyPlan([]);
            props.handleDiffCourses(props.courses);
            setLoading1(false);
        } catch (err) { handleErrors(err); setLoading1(false); };
    }
    return (
        <>
            <h1 className='mt-3 pt-3 pb-3 mb-3'>Courses List</h1>
            <MyCourseTable courses={props.courses} />
            {(props.loggedIn && props.studyPlan.length !== 0) ? <>
                <h1 className='mt-5 pt-5 pb-2 mb-2'>Study Plan </h1>

                <p className="fs-4">{props.user.fullTime === 1 ? ('Full-time: 40-60 credits') : ('Part-time: 20-40 credits')}</p>
                <p className="fs-4 pb-3 mb-3">Credits: {props.studyPlan.map(c => c.credits).reduce((c1, c2) => c1 + c2)}</p>
                <MyCourseTable courses={props.studyPlan} />
                <Link to='/edit' state={props.user.fullTime}><Button variant="warning" className='mb-5 mt-2 me-5'> Edit </Button></Link>
                {loading1 ? <Button variant="danger" className='mb-5 mt-2 ms-5' disabled>
                    <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" /> Delete </Button>
                    : <Button onClick={() => deleteStudyPlan()} variant="danger" className='mb-5 mt-2 ms-5'> Delete </Button>}

            </> : ''}
            {(props.loggedIn && props.studyPlan.length === 0) ? <>
                <p className="fs-4 mt-5 pt-5" >Click on the button "Create Study Plan" to create a personalized study plan.</p>
                <p className="fs-5 pb-3 mb-3">Specify the option "full-time" or "part-time" for the study plan that you want to create</p>
                <MyAddStudyPlan user={props.user} /></> : ''}


        </>
    );

}
/**/
export { CourseView };