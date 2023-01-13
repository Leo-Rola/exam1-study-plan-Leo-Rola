import Course from './Course';

const SERVER_URL = 'http://localhost:3001';

const getCourses = async () => {
    const response = await fetch(`${SERVER_URL}/api/courses`);
    const coursesJson = await response.json();
    if (response.ok) {
        return coursesJson.map(course => new Course(course.code, course.name, course.credits, course.students, course.maxStudents, course.incompatibleCourses, course.preparatoryCourse));
    }
    else
        throw coursesJson;
};

const getStudyPlan = async () => {
    const response = await fetch(`${SERVER_URL}/api/studyPlan`, { credentials: 'include' });
    const coursesJson = await response.json();
    if (response.ok) {
        return coursesJson.map(course => new Course(course.code, course.name, course.credits, course.students, course.maxStudents, course.incompatibleCourses, course.preparatoryCourse));
    }
    else
        throw coursesJson;
};

const getDiffCourses = async () => {
    const response = await fetch(`${SERVER_URL}/api/diffCourses`, { credentials: 'include' });
    const coursesJson = await response.json();
    if (response.ok) {
        return coursesJson.map(course => new Course(course.code, course.name, course.credits, course.students, course.maxStudents, course.incompatibleCourses, course.preparatoryCourse));
    }
    else
        throw coursesJson;
};

async function logIn(credentials) {
    let response = await fetch(SERVER_URL + '/api/sessions', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    }
    else {
        const errDetails = await response.text();
        throw errDetails;
    }
};

const getUserInfo = async () => {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
        credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) {
        return user;
    } else {
        throw user;
    }
};

const logOut = async () => {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok)
        return null;
}

const deleteStudyPlan = async () => {
    try {
        const response = await fetch(`${SERVER_URL}/api/studyPlan`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok)
            return null;

        else {
            const errMessage = await response.json();
            throw errMessage;
        }
    } catch (err) {
        throw new Error('Cannot communicate with the server');
    }

}

const changeNumberofEnrolledStudents = async (number) => {
    try {
        const response = await fetch(`${SERVER_URL}/api/courses`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ number: number }),
        });
        if (response.ok)
            return null;
        else {
            const errMessage = await response.json();
            throw errMessage;
        }
    } catch (err) {
        throw new Error('Cannot communicate with the server');
        // and/or we can get some info from the 'err' object
    }

}

const updateEnrollmentOption = async (option) => {
    try {
        const response = await fetch(`${SERVER_URL}/api/users`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ option: option }),
        });
        if (response.ok)
            return null;
        else {
            const errMessage = await response.json();
            throw errMessage;
        }
    } catch (err) {
        throw new Error('Cannot communicate with the server');

    }

}

const saveStudyPlan = async (newCourses) => {
    const response = await fetch(`${SERVER_URL}/api/studyPlan`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ newCourses: newCourses }),
    });
    if (response.ok) {
        return;
    }
    else {
        const errDetails = await response.text();
        throw errDetails;
    }
};

const API = { getCourses, getStudyPlan, getDiffCourses, logIn, getUserInfo, logOut, deleteStudyPlan, changeNumberofEnrolledStudents, updateEnrollmentOption, saveStudyPlan };
export default API;