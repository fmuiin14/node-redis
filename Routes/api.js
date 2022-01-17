let express = require('express')
let Route = express()
let redis = require('../Controllers/RedisController')

// return instructions
Route.get('/', (req, res, next) => {
  res.send('Halo, ini homepage')
})

// get all users
Route.get('/users', redis.get_all_users)

// add a new user
Route.post('/user/add', redis.add_user)

// delete a user
Route.delete('/user/delete/:id', redis.delete_user)

// get a user by id
Route.get('/user/:id', redis.get_user)

// custom
Route.get('/move_user/:id', redis.move_user)

// update a user by id
Route.put('/user/update/:id', redis.update_user)

module.exports = Route
