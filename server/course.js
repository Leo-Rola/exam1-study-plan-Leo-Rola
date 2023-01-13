'use strict'

function Course(code, name, credits, students, maxStudents, incompatibleCourses, preparatoryCourse) {
    this.code = code;
    this.name = name;
    this.credits = credits;
    this.students = students ? students : undefined;
    this.maxStudents = maxStudents ? maxStudents : undefined;
    this.incompatibleCourses = incompatibleCourses ? incompatibleCourses : undefined;
    this.preparatoryCourse = preparatoryCourse ? preparatoryCourse : undefined;

}


exports.Course = Course;
