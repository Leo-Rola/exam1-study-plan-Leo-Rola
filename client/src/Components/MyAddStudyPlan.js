import { Button, Form } from 'react-bootstrap'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function MyAddStudyPlan(props) {
    const [fullTime, setFullTime] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (fullTime !== null) {
            navigate('/add', { state: fullTime });
        }
    }

    return (
        <>
            <Form>
                <div key='inline-radio' className="mb-4">
                    <Form.Check onClick={() => setFullTime(1)}
                        inline
                        label="Full-time"
                        name="group1"
                        type='radio'
                        id='inline-radio-1'
                    />
                    <Form.Check onClick={() => setFullTime(0)}
                        inline
                        label="Part-time"
                        name="group1"
                        type='radio'
                        id='inline-radio-2'
                    />
                </div>
            </Form>
            <Button variant='secondary' onClick={handleSubmit} className='mb-5' type="submit">Create Study Plan</Button>
        </>
    )
};

export { MyAddStudyPlan };