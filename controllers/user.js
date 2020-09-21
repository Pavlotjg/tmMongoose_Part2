module.exports = {createUser, updateUser, getUser, deleteUser, getArticlesByUser};

const User = require('../models/user');
const Article = require('../models/article');

async function createUser(req, res) {
  try {
    const user = await new User({...req.body});
    await user.save();
    res.status(201);
    res.send();
  } catch (e) {
    if(e.name === 'ValidationError'){
      res.status(400);
    }else{
      res.status(500);
    }
    res.send(e.message);
  }
}

async function getUser(req, res) {
  try {
    const {userId} = req.params;
    const user = await User.findOne({_id: userId});
    if(!user){
      res.status(400);
      res.send('There is no such user');
      return
    }
    const articles = await Article.find({owner: userId});
    res.status(200);
    res.send({user, articles});
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
}

async function getArticlesByUser(req, res){
  try {
    const {userId} = req.params;
    const user = await User.findOne({_id: userId});
    if(!user){
      res.status(400);
      res.send('There is no such user');
      return
    }
    const articles = await Article.find({owner: userId});
    res.status(200);
    res.send(articles);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
}

async function updateUser(req, res) {
  try {
    const {firstName, lastName} = req.body;
    const {userId} = req.params;
    const user = await User.findOneAndUpdate({_id: userId}, {$set: {firstName, lastName}});
    await user.save();
    res.status(200);
    res.send(`User with id: ${userId} updated`);
  } catch (e) {
    if(e.name === 'ValidationError'){
      res.status(400);
    }else{
      res.status(500);
    }
    res.send(e.message);
  }
}

async function deleteUser(req, res) {
  const {userId} = req.params;
  try {
    await User.deleteOne({_id: userId});
    await Article.deleteMany({owner: userId});
    res.status(200);
    res.send(`User with id: ${userId} and all his articles was successfully deleted`);
  }catch (e) {
    res.status(500);
    res.send('Internal Server Error');
  }
}
