const { expect } = require("chai");
const { response } = require("express");
const request = require("supertest");
const assert = require("chai").assert;
const { app } = require("../app");
const db = require("../models/index");
const { User, Movies } = db;
const bcrypt = require("bcrypt");
const { BaseError } = require("sequelize");

beforeEach(() => {
  db.sequelize.truncate({ cascade: true });
});

describe("GET /movies", () => {
  it("Should return status 200", (done) => {
    request(app).get("/movies").expect(200).end(done);
  });

  it("Should return json", (done) => {
    request(app)
      .get("/movies")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(done);
  });

  it("Should return movies", (done) => {
    request(app)
      .get("/movies")
      .expect(200)
      .then((response) => {
        assert.isNotEmpty(response._body);
        assert.isArray(response._body);
        response._body.forEach((movie) =>
          assert.containsAllKeys(movie, [
            "title",
            "description",
            "director",
            "producer",
            "release_date",
            "running_time",
            "rt_score",
          ])
        );
      })
      .then(() => done(), done); // soluciona el problema de  Error: Timeout of 2000ms exceeded.
  });
});

describe("GET /movies/:title", () => {
  it("Get Movie Details By Title", (done) => {
    request(app)
      .get("/movies/Castle in the Sky")
      .expect(200)
      .then((response) => {
        assert.isNotEmpty(response._body); //no esta vacio
        assert.isNotArray(response._body);
        assert.containsAllKeys(response._body, [
          "title",
          "description",
          "director",
          "producer",
          "release_date",
          "running_time",
          "rt_score",
        ]);
      })
      .then(() => done(), done);
  });
});

describe("POST /register", () => {
  const userExample = {
    email: "cristian@gmail.com",
    password: "avalith",
    phone: "555-555-555",
    dni: "43123453",
  };

  it("should return 201", (done) => {
    request(app)
      .post("/register")
      .send(userExample)
      .expect(201)
      .then(() => done(), done);
  });

  it("should user register", (done) => {
    request(app)
      .post("/register")
      .send(userExample)
      .expect(201)
      .then(async (response) => {
        assert.isTrue(response._body.ok)
        assert.isNotEmpty(response._body); //no esta vacio
        assert.isNotArray(response._body);
        assert.containsAllKeys(response._body.usuario, [
          "email",
          "password",
          "phone",
          "dni",
          "createdAt",
          "updatedAt",
        ]);
        const userDB = await User.findOne({
          where: { email: userExample.email },
        });
        assert.exists(userDB);
        assert.isTrue(
          bcrypt.compareSync(
            userExample.password,
            response._body.usuario.password
          )
        );
      })
      .then(() => done(), done);
  });

  it("Should not allowed user to register twice", done => {
    //TO-DO
    //Check that repeated user doesnt persist
  })
});

describe("POST /login", () => {
  const userExample = {
    nombre: "Cristian",
    email: "cristian@gmail.com",
    password: "avalith",
    phone: "555-555-555",
    dni: "43123453",
  };

  it("should return 200 and a token", (done) => {
    request(app)
      .post("/register")
      .send(userExample)
      .then((user) => {
        request(app)
          .post("/login")
          .send({ email: userExample.email, password: userExample.password })
          .expect(200)
          .then((res) => {
            //checks y aserciones
          })
          .then(() => done(), done);
      });
  });
});

describe('POST /favourite/:code', () => {
  beforeEach(done => {
    //Crear usuario y pelicula
    const userExample = {
      nombre: "Cristian",
      email: "cristian@gmail.com",
      password: "avalith",
      phone: "555-555-555",
      dni: "43123453",
    };

    const movie = {
      id: "Cristian",
      MovieCode: "cristian@gmail.com",
      title: "avalith",
      stock: "555-555-555",
      rentals: "43123453",
    };
  })
  it("Should return 201 and set movie as favourite for logged user with review", done => {
    // TO-DO
    // Check status

    // Check si se registro el cambio en la DB

    // Check si el registro en la DB es correcto

  })
  it("Should return 201 and set movie as favourite for logged user without review", done => {
    // TO-DO
    // Check status
    // Check si se registro el cambio en la DB
    // Check si el registro en la DB es correcto
  })
  it("Should not allow to favourite the same movie twice", done => {
    //TO-DO, llamar al endpoint con la misma peli 2 veces
    // Check error status
    // Check error message
    // Check db que no se haya persistido un registro
  })
})

describe('GET /favourites', () => {
  beforeEach(done => {
    request(app).get("/favourites").expect(200).end(done);
  })
  it("Should return 200 status and logged user favourite list", done => {
    request(app)
      .get("/favourites")
      .expect(200)
      .then((response) => {
        assert.isNotEmpty(response._body);
        assert.isArray(response._body);
        response._body.forEach((movieFav) =>
          assert.containsAllKeys(movieFav, [
            "MovieCode",
            "UserId",
            "review",
            "MovieMovieCode",
            "createdAt",
            "updatedAt",
          ])
        );
      })
      .then(() => done(), done);
  });
});


describe('POST /rent/:code', () => {
  beforeEach(done => {
    // Crear usuario, pelicula
    const userExample = {
      nombre: "Cristian",
      email: "cristian@gmail.com",
      password: "avalith",
      phone: "555-555-555",
      dni: "43123453"
    }

    const movieExample = {
      code: "2baf70d1-42bb-4437-b551-e5fed5a87abe"
    }

    const movieWhithoutStock = {
      code: "112c1e67-726f-40b1-ac17-6974127bb9b9"
    }
  })
  request(app)
    .post('/login')
    .send(userExample)
    .expect(200)
    .then((user) => {
      request(app)
        .post(`/rent/${movieExample.code}`)
        .set({ Authorization: `Bearer ${user._body.token}` })
        .expect(201)
        .then(async (response) => {
          const rent = await Movie.findAll()
          const movie = await Movie.findOne({ where: { movieExample: code } })
          assert.equal(response._body.msg, "Rented movie")
          assert.operator(rent[0].id_rent, ">", 0)
          assert.operator(movie.rentals, ">", 0)
        })
        .then(() => done(), done)
    })
})


it.only("Should not allow rent if there is no stock", done => {

  request(app)
    .post('/login')
    .send(userExample)
    .expect(200)
    .then(async (user) => {
      const withoutStock = await Movies.update({
        data: { stock: 0, rentals: 1 },
        where: { code: movieWhithoutStock.code }
      })
      request(app)
        .post(`/rent/${withoutStock.code}`)
        .set({ Authorization: `Bearer ${user._body.token}` })
        .expect(400)
        .then(async (response) => {

          assert.equal(response._body.error, "The movie has not stock")
          assert.equal(withoutStock.stock, 0)

        })
        .then(() => done(), done);
    })
})



it("Should not allow rent if movie does not exist", done => {
  request(app)
    .post('/login')
    .send(userExample)
    .expect(200)
    .then((user) => {
      request(app)
        .post(`/rent/nonexistentcode`)
        .set({ Authorization: `Bearer ${user._body.token}` })
        .expect(404)
        .then((response) => {
          assert.equal(response._body.error, "Movie Not Found")
        })
        .then(() => done(), done);
    })
})


it("Should not allow non logged user to rent a movie", done => {

  request(app)
    .post(`/rent/${movieExample.codeExample}`)
    .expect(401)
    .then((response) => {
      assert.equal(response._body.error, "Authorization is not valid")
    })
    .then(() => done(), done);
})

describe("POST /return/:code", done => {
  beforeEach(done => {
    // Crear usuario, pelicula, y rentas, una vencida y una sin vencer
  })
  it("Should return a rental on time", done => {
    //TO-DO
    //Chequear status code 200
    //Chequear que se devuelva correctamente el precio
    //Chequear que se restockee correctamente la pelicula
    //Chequear que se persitio la fecha de devolucion
  })
  it("Should return late rental", done => {
    //TO-DO
    //Chequear status code 200
    //Chequear que se devuelva correctamente el precio con el agregado
    //Chequear que se restockee correctamente la pelicula
    //Chequear que se persitio la fecha de devolucion
  })
  it("Should return a movie that was rented a second time", done => {
    //TO-DO
  })
  it("Should not allow to rent movie twice simultaneously", done => {
    //TO-DO
  })
  it("Should not allow to return already returned movie", done => {
    //TO-DO
  })
  it("Should not allow to return non rented movie", done => {
    //TO-DO
  })
  it("Should not allow non logged user to return a movie", done => {
    //TO-DO
  })
})

describe("Not Found handling", () => {
  it("Should return status 404", (done) => {
    request(app)
      .get("/")
      .expect(404)
      .then((response) => {
        assert.equal(response.res.statusMessage, "Not Found");
      })
      .then(() => done(), done);
  });
});
