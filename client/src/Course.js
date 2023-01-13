function Course(code, name, credits, students, maxStudents, incompatibleCourses, preparatoryCourse) {
    this.code = code;
    this.name = name;
    this.credits = credits;
    this.students = students ? students : 0;
    this.maxStudents = maxStudents ? maxStudents : undefined;
    this.incompatibleCourses = incompatibleCourses ? incompatibleCourses : undefined;
    this.preparatoryCourse = preparatoryCourse ? preparatoryCourse : undefined;

}


export default Course;