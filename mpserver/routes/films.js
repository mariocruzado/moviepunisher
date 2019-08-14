const express = require('express');
const router = express.Router();

const filmController = require('../controllers/filmController');

router.post('/:id', filmController.addFilm);
router.delete('/:id', filmController.deleteFilm);
router.get('/:id', filmController.getFilm);
router.get('/', filmController.getFilms);

module.exports = router;