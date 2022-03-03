jest.setTimeout(30000);
const app = require("../app");
const supertest = require("supertest");
let id;

test("POST api/v1/course/create", async () => {
  const user = {
    email: "salah@gmail.com",
    password: "Salah123!",
  };
  const res = await supertest(app).post("/api/v1/user/login").send(user);
  await supertest(app)
    .post("/api/v1/course/create")
    .set("Authorization", `Bearer ${res.body.result.token}`)
    .field("title", "Belajar Golang")
    .attach("image", "public/image.jpg")
    .field("description", "belajar untuk pemula")
    .field("user_id", `${res.body.result.user.id}`)
    .field("category_id", `1`)
    .expect(201)
    .then((res) => {
      id = res.body.result.id;
      expect(res.body.status).toBe("success");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
test("GET api/v1/course/fetch", async () => {
  await supertest(app)
    .get("/api/v1/course/fetch")
    .expect(200)
    .then((res) => {
      expect(res.body.status).toBe("success");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
test("GET api/v1/course/fetch/detail", async () => {
  await supertest(app)
    .get(`/api/v1/course/fetch/detail?courseId=${id}`)
    .expect(200)
    .then((res) => {
      expect(res.body.status).toBe("success");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
test("PUT api/v1/course/edit", async () => {
  const user = {
    email: "salah@gmail.com",
    password: "Salah123!",
  };
  const res = await supertest(app).post("/api/v1/user/login").send(user);
  const body = {
    title: "edit course",
  };
  await supertest(app)
    .put(`/api/v1/course/edit?courseId=${id}`)
    .set("Authorization", `Bearer ${res.body.result.token}`)
    .send(body)
    .expect(200)
    .then((res) => {
      expect(res.body.status).toBe("Success");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
test("DELETE api/v1/course/delete", async () => {
  const user = {
    email: "salah@gmail.com",
    password: "Salah123!",
  };
  const res = await supertest(app).post("/api/v1/user/login").send(user);
  await supertest(app)
    .delete(`/api/v1/course/delete?courseId=${id}`)
    .set("Authorization", `Bearer ${res.body.result.token}`)
    .expect(200)
    .then((res) => {
      expect(res.body.status).toBe("Success");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
