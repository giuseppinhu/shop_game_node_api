const express = require("express");
const app = express();
const port = 4040;

const cors = require("cors");
const JWT = require("jsonwebtoken");

const JWTSecret = "hjskahfdljshsajdkçlasasdfa";

app.use(cors());

const connection = require("../db/database");

const Game = require("../db/Game");

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const DB = {
  users: [
    {
      id: 2,
      email: "teste@gmail.com",
      password: "123456",
    },
    {
      id: 15,
      email: "admin@teste.com",
      password: "admin1",
    },
  ],
};

connection
  .authenticate()
  .then(() => {
    console.log("Conectado ao DB com sucesso!");
  })
  .catch((err) => {
    console.log(`Ocorreu um error: ${err}`);
  });

const auth = (req, res, next) => {
  const authToken = req.headers["authorization"];

  if (authToken != undefined) {
    const bearer = authToken.split(" ");
    const token = bearer[1];

    JWT.verify(token, JWTSecret, (error, data) => {
      if (error) {
        res.status(401);
        res.json({ error: "Token Inválido!" });
      } else {
        req.token = token;
        req.loggedUser = { id: data.id, email: data.email };
        next();
      }
    });
  } else {
    res.status(401);
    res.json({ error: "Token Inválido!" });
  }
};

// ROUTE GET
app.get("/games", auth, (req, res) => {
  res.statusCode = 200;
  Game.findAll().then((games) => {
    res.json(games);
  });
});

// ROUTE GET FIND ID
app.get("/game/:id", auth, (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    var id = parseInt(req.params.id);

    Game.findOne({
      where: {
        id: id,
      },
    }).then((game) => {
      if (game == undefined) {
        res.sendStatus(404);
      } else {
        res.json(game);
        res.sendStatus(200);
      }
    });
  }
});

// ROUTE CREATE
app.post("/game", auth, (req, res) => {
  var { title, year, price } = req.body;

  Game.create({
    title: title,
    price: price,
    year: year,
  })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      res.sendStatus(400);
    });
});

// ROUTE DELETE
app.delete("/game/:id", auth, (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    var id = parseInt(req.params.id);

    Game.destroy({
      where: {
        id: id,
      },
    })
      .then((game) => {
        res.sendStatus(200);
      })
      .catch((error) => {
        res.sendStatus(400);
      });
  }
});

// ROUTE EDIT
app.put("/game/:id", auth, (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    var id = parseInt(req.params.id);

    var { title, price, year } = req.body;

    Game.update(
      {
        title: title,
        price: price,
        year: year,
      },
      {
        where: {
          id: id,
        },
      }
    ).then((game) => {
      if (game === undefined) {
        res.sendStatus(400);
      } else {
        res.sendStatus(200);
      }
    });
  }
});

app.post("/auth", (req, res) => {
  var { email, password } = req.body;

  if (email != undefined) {
    var user = DB.users.find((user) => user.email === email);

    if (user != undefined) {
      if (password != undefined) {
        if (user.password == password) {
          JWT.sign(
            { id: user.id, email: user.email },
            JWTSecret,
            {
              expiresIn: "48h",
            },
            (error, token) => {
              if (error) {
                res.status(401);
                res.json({ error: "Erro interno." });
              } else {
                res.status(200);
                res.json({ token: token });
              }
            }
          );
        } else {
          res.status(401);
          res.json({ error: "Senha não Autorizada!" });
        }
      } else {
        res.status(404);
        res.json({ error: "Senha Inválida!" });
      }
    } else {
      res.status(404);
      res.json({ error: "Email não encontrado!" });
    }
  } else {
    res.status(400);
    res.json({ error: "Email Inválido" });
  }
});

app.listen(port, () => {
  console.log(`Rodando na porta: ${port}`);
});
