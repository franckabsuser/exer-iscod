const express = require('express');
const articlesController = require('./articles.controller');
const authenticate = require('../../middlewares/auth');

const router = express.Router();

// Route pour créer un article
router.post('/', articlesController.create);

// Route pour mettre à jour un article
router.put('/:id',authenticate, articlesController.update);

// Route pour supprimer un article
router.delete('/:id',authenticate, articlesController.delete);

module.exports = router;
