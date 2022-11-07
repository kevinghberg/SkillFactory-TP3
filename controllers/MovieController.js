const fetch = (url) => import('node-fetch').then(({ default: fetch }) => fetch(url));
const GHIBLI_APP = 'https://ghibliapi.herokuapp.com/films/'
const db = require('../models/index')
const { Movie, FavouriteFilms } = db;
const jwt = require("jsonwebtoken");
const favouritefilms = require('../models/favouritefilms');


async function getFilmFromAPIByName(name) {
  try {
    let films = await fetch(GHIBLI_APP)
    films = await films.json();
    return films.find(film => film.title.includes(name))
  } catch (error) {
    return next(error)
  }
}

const addMovie = (req, res, next) => {
  try {
    const movieAPI = getFilmFromAPIByName(req.body.title)
    const newMovie = {
      MovieCode: movieAPI.id,
      title: movieAPI.title,
      stock: 5,
      rentals: 0,
    }
    Movie.create(newMovie)
      .then(movie => res.status(201).send('Movie added'))
  } catch (error) {
    error = new Error()
    error.status = 400;
    res.status(400).send('Bad Request')
    return next(error);
  }
}

const getMovies = async (req, res) => {
  try {
    let movies = await fetch(GHIBLI_APP)
    const { order } = req.query
    movies = await movies.json();

    movies = movies.map(movie => ({
      id: movie.id,
      title: movie.title,
      description: movie.description,
      director: movie.director,
      producer: movie.producer,
      release_date: movie.producer,
      running_time: movie.running_time,
      rt_score: movie.rt_score
    }));

    if (order == 'desc') {
      movies.sort((a, b) => -b.release_date - a.release_date)
    } else if (order == "asc") {
      movies.sort((a, b) => -a.release_date - b.release_date);
    }
    res.status(200).send(movies);
  } catch (error) {
    error = new Error("Not found");
    error.status = 404;
    res.status(404).send("Not Found");
    return next(error);
  }
}


const addFavourite = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { review } = req.body;
    console.log(req.body);

    Movie.findOne({ where: { MovieCode: code } }).then((film) => {
      if (!film) throw new Error(" Movie not available ");
      const newFavouriteFilms = {
        MovieCode: code,
        UserId: req.body.UserId,
        review: review,
      };

      FavouriteFilms.create(newFavouriteFilms).then((newFav) => {
        if (!newFav) throw new Error("FAILED to add favorite movie");
        res.status(201).send("Movie Added to Favorites");
      });
    });
  } catch (error) {
    error = new Error();
    error.status = 400;
    res.status(400).send("Film does not exist");
    return next(error);
  }
};

const allFavouritesMovies = async (req, res, next) => {
  try {
    const { order } = req.query;
    const { id } = req.params;
    const allFilms = await FavouriteFilms.findAll({
      where: { UserId: id },
    });
    const filmReduced = allFilms.map((film) => {
      if (film.review != null) {
        return film;
      } else {
        return {
          id: film.id,
          MovieCode: film.MovieCode,
          UserId: film.userId,
        };
      }
    });
    if (order == 'desc') {
      filmReduced.sort((a, b) => -b.MovieCode - a.MovieCode)
    } else if (order == "asc") {
      filmReduced.sort((a, b) => -a.MovieCode - b.MovieCode);
    }
    res.status(200).json(filmReduced);
  } catch (error) {
    error = new Error();
    error.status = 400;
    res.status(400).send('Error showing Favorite Movies');
    return next(error);
  }


};



const getMovieByTitle = async (req, res, next) => {
  try {
    const { title } = req.params;
    const titleFormated = title.split("-").join(" ");
    console.log(titleFormated);
    const response = await fetch("https://ghibliapi.herokuapp.com/films");
    const movies = await response.json();
    const movie = movies.find((movie) => movie.title === titleFormated);
    movie
      ? res.status(200).json(movie)
      : res.status(404).json({ errorMessage: "Movie not found" });
  } catch (error) {
    error = new Error();
    error.status = 404;
    res.status(404).send("Movie Not Found");
    return next(error);
  }
};

module.exports = {
  getMovies,
  addFavourite,
  addMovie,
  allFavouritesMovies,
  getMovieByTitle
}