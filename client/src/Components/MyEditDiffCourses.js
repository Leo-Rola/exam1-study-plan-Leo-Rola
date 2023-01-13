import 'bootstrap/dist/css/bootstrap.min.css'
import { Table, Container, Row, Col, Collapse } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from 'react';

function MyEditDiffCourses(props) {
    return (<Container fluid>
        <Row className="justify-content-center">
            <Col sm='10'>
                <Table className="table table-striped">
                    <thead>
                        <tr>
                            <th><strong>Code</strong></th>
                            <th><strong>Name</strong></th>
                            <th><strong>Credits</strong></th>
                            <th><strong>Students</strong></th>
                            <th><strong>Max Students</strong></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.courses.sort((c1, c2) => { if (c1.name > c2.name) return 1; else return -1; }).map((c) => <CourseRow key={c.code} course={c} addCourse={props.addCourse} />)}

                    </tbody>
                </Table>
            </Col>
        </Row>
    </Container>
    );
}

function CourseRow(props) {
    const [showDetails, setShowDetails] = useState(false);
    const handleDetails = () => showDetails ? setShowDetails(false) : setShowDetails(true);
    return (
        <><tr className={props.course.warning ? 'bg-warning' : ''}>
            <td>{props.course.code}</td>
            <td>{props.course.name}</td>
            <td>{props.course.credits}</td>
            <td>{props.course.students}</td>
            {props.course.maxStudents ? <td>{props.course.maxStudents}</td> : <td></td>}
            <td><i onClick={handleDetails} className="bi bi-three-dots"></i></td>
            <td><svg onClick={() => props.addCourse(props.course)} xmlns="http://www.w3.org/2000/svg" width="20" fill='green' height="20" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
            </svg></td>
        </tr>
            <Collapse in={showDetails}>
                <div id="example-collapse-text">
                    <Row>
                        <Col><strong>Incompatible Courses:</strong></Col><Col>{props.course.incompatibleCourses}</Col></Row>
                    <Row><Col><strong>Preparatory Course:</strong></Col><Col>{props.course.preparatoryCourse}</Col></Row>
                </div></Collapse>

        </>
    );
}

export { MyEditDiffCourses };