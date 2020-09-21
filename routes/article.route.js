const express = require('express');
const router = express.Router();

const articleController = require('../controllers/articles');

router.get('/', articleController.getArticles);

router.post('/', articleController.createArticles);

router.put('/:articleId', articleController.updateArticle);

router.delete('/:articleId', articleController.deleteArticle);

module.exports = router;
