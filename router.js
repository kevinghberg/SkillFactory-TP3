const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const MovieController = require('./controllers/MovieController')
const UserController = require('./controllers/UserController')
const RentController = require('./controllers/RentController')
const errorHandler = require("./middlewares/errorHandler");
router.use(bodyParser.json())

router.get('/movies', MovieController.getMovies);
router.get("/movies/:title", MovieController.getMovieByTitle);
router.post("/favourite/:code", MovieController.addFavourite);
router.get("/favourites/:id", MovieController.allFavouritesMovies);

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);

router.get("/rents", RentController.allRents);
router.put("/rent/:code", RentController.refundMovie);
router.post("/rent/:code", RentController.rentMovie);

router.use(errorHandler.errorParser);

module.exports = router;