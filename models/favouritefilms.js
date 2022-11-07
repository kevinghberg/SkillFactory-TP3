'use strict';
const { Model } = require("sequelize");
const { Movie, User } = require
module.exports = (sequelize, DataTypes) => {
  class FavouriteFilms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      FavouriteFilms.hasMany(models.Movie, {
        foreignKey: "MovieCode",
        target_key: "MovieCode",
      });
      FavouriteFilms.hasMany(models.User, {
        foreignKey: "id",
        target_key: "id_user",
      });
    }
  }
  FavouriteFilms.init(
    {
      MovieCode: {
        type: DataTypes.INTEGER,
        unique: true,
        references: {
          model: Movie,
          key: "id",
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        references: {
          model: User,
          key: "id",
        },
      },
      review: DataTypes.STRING,
      MovieMovieCode: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },

    {
      sequelize,
      modelName: "FavouriteFilms",
    }
  );
  return FavouriteFilms;
};