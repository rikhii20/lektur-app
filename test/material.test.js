jest.setTimeout(30000);
const app = require("../app");
const supertest = require("supertest");
const { Course } = require("../models");
let id;

test("POST api/v1/material/create", async () => {
  const user = {
    email: "salah@gmail.com",
    password: "Salah123!",
  };
  const res = await supertest(app).post("/api/v1/user/login").send(user);
  const course = await supertest(app)
    .post("/api/v1/course/create")
    .set("Authorization", `Bearer ${res.body.result.token}`)
    .field("title", "belajar teross")
    .attach("image", "public/image.jpg")
    .field("description", "belajar pokoke")
    .field("user_id", `${res.body.result.user.id}`)
    .field("category_id", `1`);

  const content = await supertest(app)
    .post(`/api/v1/content/create?courseId=${course.body.result.id}`)
    .set("Authorization", `Bearer ${res.body.result.token}`)
    .field("title", "lesson 1")
    .field("description", "belajar untuk pemula")
    .attach("video", "public/video.mp4")
    .field("course_id", `${course.body.result.id}`);

  await supertest(app)
    .post(`/api/v1/material/create?contentId=${content.body.result.id}`)
    .set("Authorization", `Bearer ${res.body.result.token}`)
    .field("name", "golang book")
    .attach("url", "public/document.pdf")
    .field("content_id", `${content.body.result.id}`)
    .expect(201)
    .then((res) => {
      id = res.body.result.id;
      expect(res.body.status).toBe("Success");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
test("GET api/v1/material/fetch", async () => {
  await supertest(app)
    .get("/api/v1/material/fetch")
    .expect(200)
    .then((res) => {
      expect(res.body.status).toBe("Success");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
test("PUT api/v1/material/edit", async () => {
  const user = {
    email: "salah@gmail.com",
    password: "Salah123!",
  };
  const res = await supertest(app).post("/api/v1/user/login").send(user);
  const body = {
    name: "edit material",
  };
  await supertest(app)
    .put(`/api/v1/material/edit?materialId=${id}`)
    .set("Authorization", `Bearer ${res.body.result.token}`)
    .send(body)
    .expect(200)
    .then((res) => {
      expect(res.body.status).toBe("Success");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
test("DELETE api/v1/material/delete", async () => {
  const user = {
    email: "salah@gmail.com",
    password: "Salah123!",
  };
  const res = await supertest(app).post("/api/v1/user/login").send(user);
  await supertest(app)
    .delete(`/api/v1/material/delete?materialId=${id}`)
    .set("Authorization", `Bearer ${res.body.result.token}`)
    .expect(200)
    .then((res) => {
      expect(res.body.status).toBe("Success");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
