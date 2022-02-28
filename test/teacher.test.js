jest.setTimeout(50000);
const app = require("../app");
const supertest = require("supertest");
const { Course, StudentCourse, Invitation } = require("../models");

afterAll(async () => {
  Course.destroy({
    where: {
      title: "belajar teross",
    },
  });
});
afterAll(async () => {
  StudentCourse.destroy({
    where: {
      course_id: 1,
    },
  });
});
afterAll(async () => {
  Invitation.destroy({
    where: {
      teacher_id: 22,
    },
  });
});

test("GET api/v1/teacher/dashboard", async () => {
  const student = {
    email: "jajang@gmail.com",
    password: "Salah123!",
  };
  const res = await supertest(app).post("/api/v1/user/login").send(student);
  await supertest(app)
    .get("/api/v1/teacher/dashboard")
    .set("Authorization", `Bearer ${res.body.result.token}`)
    .expect(200)
    .then((res) => {
      expect(res.body.status).toBe("Success");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
test("GET api/v1/teacher/course/students", async () => {
  const student = {
    email: "jajang@gmail.com",
    password: "Salah123!",
  };
  const res = await supertest(app).post("/api/v1/user/login").send(student);
  await supertest(app)
    .get("/api/v1/teacher/course/students?courseId=2")
    .set("Authorization", `Bearer ${res.body.result.token}`)
    .expect(200)
    .then((res) => {
      expect(res.body.status).toBe("Success");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
test("PUT api/v1/teacher/approved", async () => {
  const user = {
    email: "jajang@gmail.com",
    password: "Salah123!",
  };
  const res = await supertest(app).post("/api/v1/user/login").send(user);
  const body = {
    status: 1,
  };
  await supertest(app)
    .put(`/api/v1/teacher/approved?studentId=25&courseId=2`)
    .set("Authorization", `Bearer ${res.body.result.token}`)
    .send(body)
    .expect(200)
    .then((res) => {
      expect(res.body.status).toBe("Success");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
test("POST api/v1/teacher/sent-invitation", async () => {
  const user = {
    email: "jajang@gmail.com",
    password: "Salah123!",
  };
  const res = await supertest(app).post("/api/v1/user/login").send(user);
  const student = {
    email: "rikhisobari20@gmail.com",
    teacher_id: res.body.result.id,
    course_id: 2,
    isApproved: false,
  };
  await supertest(app)
    .post("/api/v1/teacher/sent-invitation?courseId=2")
    .set("Authorization", `Bearer ${res.body.result.token}`)
    .send(student)
    .expect(201)
    .then((res) => {
      expect(res.body.status).toBe("Success");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
