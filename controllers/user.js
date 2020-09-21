module.exports = {createUser, getUsers, updateUser, getUser, deleteUser};

const User = require('../models/user');

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

async function getUsers(req, res) {
  try {
    const users = await User.find({});
    res.status(200);
    res.send(users);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
}

async function getUser(req, res) {
  try {
    const {id} = req.params;
    const user = await User.find({_id: id});
    res.status(200);
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
}

async function updateUser(req, res) {
  try {
    const {firstName, lastName} = req.body;

    const {id} = req.params;
    console.log(firstName, lastName);
    //TODO: figure out how to omit undefined ; $set: vs nothing
    const user = await User.findOneAndUpdate({_id: id}, {firstName, lastName});
    await user.save();
    res.status(200);
    res.send(`User with id: ${id} updated`);
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
  const {id} = req.params;
  try {
    await User.deleteOne({_id: id});
    res.status(200);
    res.send(`Todo with id: ${id} was successfully deleted`);
  }catch (e) {
    res.status(500);
    res.send('Internal Server Error');
  }
}
