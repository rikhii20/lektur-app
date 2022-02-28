const app = require("../app");
const supertest = require("supertest");
const { StudentContent } = require("../models");

afterAll(async () => {
  StudentContent.destroy({
    where: {
      student_id: 25,
    },
  });
});

test("GET api/v1/student/dashboard", async () => {
  const student = {
    email: "nurul@gmail.com",
    password: "Salah123!",
  };
  const res = await supertest(app).post("/api/v1/user/login").send(student);
  await supertest(app)
    .get("/api/v1/student/dashboard")
    .set("Authorization", `Bearer ${res.body.result.token}`)
    .expect(200)
    .then((res) => {
      expect(res.body.status).toBe("Success");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
test("GET api/v1/student/popup/content", async () => {
  const student = {
    email: "nurul@gmail.com",
    password: "Salah123!",
  };
  const res = await supertest(app).post("/api/v1/user/login").send(student);
  await supertest(app)
    .get("/api/v1/student/popup/content?courseId=1")
    .set("Authorization", `Bearer ${res.body.result.token}`)
    .expect(200)
    .then((res) => {
      expect(res.body.status).toBe("Success");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
test("GET api/v1/student/popup/material", async () => {
  const student = {
    email: "nurul@gmail.com",
    password: "Salah123!",
  };
  const res = await supertest(app).post("/api/v1/user/login").send(student);
  await supertest(app)
    .get("/api/v1/student/popup/material?courseId=1")
    .set("Authorization", `Bearer ${res.body.result.token}`)
    .expect(200)
    .then((res) => {
      expect(res.body.status).toBe("Success");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
test("POST api/v1/student/content/unlocked/create", async () => {
  const student = {
    email: "nurul@gmail.com",
    password: "Salah123!",
  };
  const res = await supertest(app).post("/api/v1/user/login").send(student);
  const unlocked = {
    course_id: 2,
    content_id: 2,
  };
  await supertest(app)
    .post("/api/v1/student/content/unlocked/create?courseId=2&contentId=2")
    .set("Authorization", `Bearer ${res.body.result.token}`)
    .send(unlocked)
    .expect(201)
    .then((res) => {
      expect(res.body.status).toBe("Success");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
test("GET api/v1/student/content/unlocked/fetch", async () => {
  const student = {
    email: "nurul@gmail.com",
    password: "Salah123!",
  };
  const res = await supertest(app).post("/api/v1/user/login").send(student);
  await supertest(app)
    .get("/api/v1/student/content/unlocked/fetch")
    .set("Authorization", `Bearer ${res.body.result.token}`)
    .expect(200)
    .then((res) => {
      expect(res.body.status).toBe("Success");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
