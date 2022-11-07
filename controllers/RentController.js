const db = require('../models/index');
const { Rent, Movie } = db
const { Op } = require('sequelize');

const rentMovie = (req, res, next) => {
    try {
        const { code } = req.params;

        Movie.findOne({ where: { MovieCode: code, stock: { [Op.gt]: 0 } } })
            .then(rental => {
                if (!rental) throw new Error(' Missing stock ')
                Rent.create({
                    MovieCode: rental.MovieCode,
                    id_user: req.body.id_user,
                    rent_date: new Date(Date.now()),
                    refund_date: new Date(Date.now() + (3600 * 1000 * 24) * 7),
                }).then(data => {
                    Movie.update({ stock: rental.stock - 1, rentals: rental.rentals + 1 }, { where: { MovieCode: rental.MovieCode } })
                        .then(() => res.status(201).send(data))
                })
            })
    } catch (error) {
        error = new Error();
        error.status = 400;
        res.status(400).send("Error occurred while renting a movie");
        return next(error);
    }

}

const refundMovie = (req, res, next) => {
    try {
        const { code } = req.params;
        Rent.update(
            { userRefund_date: Date.now() },
            { where: { MovieCode: code, id_user: req.usuario.id_user } }
        ).then(async (rent) => {
            let movie = await Movie.findOne({ where: { MovieCode: code } });
            Movie.update({ stock: movie.stock + 1 }, { where: { MovieCode: code } }).then(
                () => {
                    let diasDevolucion = Date().getTime(rent.Rent_date) - Date().getTime(rent.userRefund_date);
                    let diasAlquiler = Date().getTime(rent.Rent_date) - Date().getTime(rent.refund_date);
                    let valorAlquiler = diasAlquiler * 10;
                    if (diasDevolucion <= diasAlquiler) {
                        res.status(200).send({
                            msg: `Return on time, Final Price: ${diasAlquiler * 10
                                }`,
                            onTime: true,
                        });
                    } else {
                        res.status(200).send({
                            msg: `Return out of time, Final Price: ${lateRefund(valorAlquiler, diasDevolucion)
                                }`,
                            onTime: false
                        });
                    }
                });
        });
    } catch (error) {
        error = new Error();
        error.status = 400;
        res.status(400).send("Error on refund");
        return next(error);
    }
};

//Funcion agregar un 10% del precio original por cada dia de tardanza
const lateRefund = async (originalPrice, daysLate) => {
    let finalPrice = originalPrice;

    //bucle dayslate cada dia que tarda
    for (let i = 0; i < daysLate; i++) {
        finalPrice += finalPrice * 0.1
    };

    return finalPrice;
}

const allRents = async (req, res, next) => {
    try {
        let { order } = req.query;
        const rents = await Rent.findAll();

        rent = rents.map(rent => ({
            id_Rent: rent,
            id_user: rent.id_user,
            MovieCode: rent.MovieCode,
            rent_date: rent.rent_date,
            refund_date: rent.refund_date,
            userRefund_date: rent.userRefund_date
        }));

        if (order == 'desc') {
            rent.sort((a, b) => -b.rent_date - a.rent_date)
        } else if (order == "asc") {
            rent.sort((a, b) => -a.rent_date - b.rent_date);
        }
        res.status(200).json(rent);
    } catch (error) {
        error = new Error("");
        error.status = 400;
        res.status(400).send("Error");
        return next(error);
    }
}

module.exports = {
    rentMovie,
    refundMovie,
    allRents
}