import { Row, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useContext } from 'react';

import MessageContext from '../messageCtx';
import { MyEditStudyPlan } from '../Components/MyEditStudyPlan';
import { MyEditDiffCourses } from '../Components/MyEditDiffCourses';
import API from '../API';

function EditView(props) {
    const { handleErrors } = useContext(MessageContext);
    const location = useLocation();
    const fullTime = location.state ? location.state : 0;
    const navigate = useNavigate();
    const [studyPlanBis, setStudyPlanBis] = useState(props.studyPlan);
    const [diffCoursesBis, setDiffCoursesBis] = useState(props.diffCourses);
    const [messageErr, setMessageErr] = useState('');
    const [loading2, setLoading2] = useState(false);

    const saveStudyPlan = async () => {
        let count = studyPlanBis.map(c => c.credits).reduce((c1, c2) => c1 + c2);
        if (fullTime === 1) {
            if (count < 60 || count > 80) {
                setMessageErr({ msg: "Your credits must be greater than or equal to 60 and smaller than or equal to 80", type: 'danger' });
                return;
            }
        } else {
            if (count < 20 || count > 40) {
                setMessageErr({ msg: "Your credits must be greater than or equal to 20 and smaller than or equal to 40", type: 'danger' });
                return;
            }
        }
        let newCourses = [];
        for (let i = 0; i < studyPlanBis.length; i++)
            newCourses[i] = studyPlanBis[i].code;
        try {
            setLoading2(true);
            if (props.studyPlan.length !== 0) {
                await API.changeNumberofEnrolledStudents(-1);
                await API.deleteStudyPlan();
            }
            await API.saveStudyPlan(newCourses);
            await API.changeNumberofEnrolledStudents(1);
            await API.updateEnrollmentOption(fullTime);
            props.handleStudyPlan(studyPlanBis);
            props.handleDiffCourses(diffCoursesBis);
            props.handleUser(fullTime);
            navigate('/');
            setLoading2(false);
        } catch (err) { handleErrors(err); setLoading2(false); };
    }

    const backTrack = () => {
        navigate('/');
    }

    const deleteCourse = (course) => {
        if (studyPlanBis.find(c => c.preparatoryCourse === course.code) === undefined) {
            setStudyPlanBis(() => studyPlanBis.filter((c) => c.code !== course.code));
            setDiffCoursesBis(diffCoursesBis => [...diffCoursesBis, course]);
            setDiffCoursesBis(diffCoursesBis => diffCoursesBis.map((c) => { return { code: c.code, name: c.name, credits: c.credits, students: c.students, maxStudents: c.maxStudents, incompatibleCourses: c.incompatibleCourses, preparatoryCourse: c.preparatoryCourse, warning: false }; }));
            setMessageErr('');
        } else {
            setMessageErr({ msg: "You can't delete a preparatory course", type: 'warning' });
        }
    }

    const addCourse = (course) => {
        if (course.incompatibleCourses !== undefined) {
            let incompatibles = course.incompatibleCourses.split('\n');
            for (const element of incompatibles) {
                if (studyPlanBis.find(s => s.code === element) !== undefined) {
                    setDiffCoursesBis(diffCourses => {
                        return diffCourses.map(diffCourse => {
                            if (diffCourse.code === course.code) {
                                return { code: course.code, name: course.name, credits: course.credits, students: course.students, maxStudents: course.maxStudents, incompatibleCourses: course.incompatibleCourses, preparatoryCourse: course.preparatoryCourse, warning: true };
                            } else
                                return diffCourse;
                        });
                    });
                    setMessageErr({ msg: "You're trying to add a course that's incompatible with your study plan!", type: 'warning' });
                    return;
                }
            }
        }
        if (course.maxStudents !== undefined && course.students === course.maxStudents) {
            setDiffCoursesBis(diffCourses => {
                return diffCourses.map(diffCourse => {
                    if (diffCourse.code === course.code) {
                        return { code: course.code, name: course.name, credits: course.credits, students: course.students, maxStudents: course.maxStudents, incompatibleCourses: course.incompatibleCourses, preparatoryCourse: course.preparatoryCourse, warning: true };
                    } else
                        return diffCourse;
                });
            });
            setMessageErr({ msg: "Max numbers of students reached, you can't add the course to your study plan", type: 'warning' });
            return; //check corso pieno
        }
        if (course.preparatoryCourse === undefined || studyPlanBis.find(s => s.code === course.preparatoryCourse) !== undefined) { //check propeudetico
            setStudyPlanBis(studyPlanBis => [...studyPlanBis, course]);
            setDiffCoursesBis(() => diffCoursesBis.filter((c) => c.code !== course.code).map((c) => { return { code: c.code, name: c.name, credits: c.credits, students: c.students, maxStudents: c.maxStudents, incompatibleCourses: c.incompatibleCourses, preparatoryCourse: c.preparatoryCourse, warning: false }; }));
            setMessageErr('');
        } else {
            setDiffCoursesBis(diffCourses => {
                return diffCourses.map(diffCourse => {
                    if (diffCourse.code === course.code) {
                        return { code: course.code, name: course.name, credits: course.credits, students: course.students, maxStudents: course.maxStudents, incompatibleCourses: course.incompatibleCourses, preparatoryCourse: course.preparatoryCourse, warning: true };
                    } else
                        return diffCourse;
                });
            });
            setMessageErr({ msg: "Preparatory course not inserted in your study plan", type: 'warning' });
            return;
        }
    }

    return (
        <>
            <h1 className='mt-2 pt-2 pb-2 mb-2'>Study Plan </h1>
            <p className="fs-4">{fullTime === 1 ? ('Full-time: 60-80 credits') : ('Part-time: 20-40 credits')}</p>
            <p className="fs-4 pb-3 mb-3">Credits: {studyPlanBis.length !== 0 ? studyPlanBis.map(c => c.credits).reduce((c1, c2) => c1 + c2) : '0'}</p>
            <MyEditStudyPlan courses={studyPlanBis} deleteCourse={deleteCourse} />
            <Button className='mb-4 mt-2 me-5' variant="dark" onClick={() => backTrack()}>Cancel</Button>
            {loading2 ? <Button className='mb-4 mt-2 ms-5' variant="success" disabled>
                <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />Save</Button>
                : <Button className='mb-4 mt-2 ms-5' variant="success" onClick={() => saveStudyPlan()}>Save</Button>}
            {messageErr && <Row>
                <Alert variant={messageErr.type} onClose={() => setMessageErr('')} dismissible>{messageErr.msg}</Alert>
            </Row>}
            <p className='fs-3 mt-1 pt-1 pb-3 mb-3'>Remaining Courses</p>
            <MyEditDiffCourses courses={diffCoursesBis} addCourse={addCourse} />
        </>
    );
}

export { EditView };