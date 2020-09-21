module.exports = {createArticles, getArticles, updateArticle, deleteArticle};

const Article = require('../models/article');
const User = require('../models/user');

async function getArticles(req, res) {
  try {
    const criterias = [
      'title',
      'subtitle',
      'description',
      'owner',
      'category',
      'createdAt',
      'updatedAt'
    ];

    //TODO: maybe we can ignore undefined fields on FIND-level
    const query = criterias.reduce((acc, criteria) => {
      if(req.query[criteria]){
        acc[criteria] = req.query[criteria];
      }
      return acc;
    }, {});
    const articles = await Article.find(query).populate('owner');
    res.status(200);
    res.send(articles);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
}

async function createArticles(req, res) {
  try {
    const {owner} = req.body;
    if (!owner) {
      res.status(400);
      res.send('Field "owner" can not be empty');
      return
    }
    const user = await User.findOne({_id: owner});
    if (user) {
      const article = await new Article({...req.body});
      await article.save();
      //TODO: aggregate field?
      await User.findOneAndUpdate({_id: owner}, {numberOfArticles: user.numberOfArticles + 1});
      res.status(201);
      res.send('article created');
    } else {
      res.status(400);
      res.send(`Owner with id: ${owner} is not found`);
    }
  } catch (e) {
    if (e.name === 'ValidationError') {
      res.status(400);
    } else {
      res.status(500);
    }
    res.send(e.message);
  }
}

async function updateArticle(req, res) {
  try {
    const {articleId} = req.params;
    const article = await Article.find({_id: articleId});
    if (!article) {
      res.status(400);
      res.send('There is no such article');
      return
    }
    const {owner} = article;
    const user = await User.find({_id: owner});
    if (user) {
      const upd = await Article.findOneAndUpdate({_id: articleId}, {$set: {...req.body}});
      console.log(upd);
      res.status(200);
      res.send('Article successfully updated');
    } else {
      res.status(400);
      res.send(`User with id: ${owner} is not found`);
    }
  } catch (e) {
    if (e.name === 'ValidationError') {
      res.status(400);
    } else {
      res.status(500);
    }
    res.send(e.message);
  }
}

async function deleteArticle(req, res) {
  try {
    const {articleId} = req.params;
    const article =  await Article.findOne({_id: articleId});
    if(!article){
      res.status(400);
      res.send('There is no such article');
      return
    }
    const {owner} = article;
    const user = await User.findOne({_id: owner});
    if (user) {
      await User.findOneAndUpdate({_id: owner}, {numberOfArticles: user.numberOfArticles - 1});
      await Article.findOneAndDelete({_id: articleId});
      res.status(200);
      res.send('Article successfully deleted');
    } else {
      res.status(400);
      res.send(`User with id: ${owner} is not found`);
    }
  } catch (e) {
    if (e.name === 'ValidationError') {
      res.status(400);
    } else {
      res.status(500);
    }
    res.send(e.message);
  }
}
