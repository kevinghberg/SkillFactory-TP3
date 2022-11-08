const errorParser = (error, req, res, next) => {
    if (error.status === 404) {
        res.status(404).send("Not found");
    } else if (error.status === 400) {
        res.status(400).send('Bad Request')
    } else if (error.status === 401) {
        res.status(401).send("Unauthorized");
    } else {
        res.status(500).send("Server ERROR");
    }
};

const errorHandler = {
    errorParser
};

module.exports = errorHandler;