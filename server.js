var express = require('express')
var fs = require('fs')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var app = express()
var Prefood = require('./models/prefood')
var Setting = require('./models/setting')
var slack = require('./lib/slack')
var helper = require('./lib/helper')
var config = require('./config')

app.set('view engine', 'jade')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static('public'))
mongoose.connect(config.mongodb)

app.put('/prefood/owner/:fid', (req, res) => {
  Prefood.changeTodayPrefood(req.params.fid, (error, result) => {
    if (error) return res.status(400).send({error: error.message})
    res.status(200).send(result)
  })
})

app.post('/food/feedback', (req, res) => {
  Prefood.rateFood(req.body, (error, results) => {
    if (error) return res.status(400).json(error)
    if(req.query.format === 'json') return res.json(results)
    res.redirect('/food/today')
  })
})

app.get('/ping', (req, res) => {
  res.json({timestamp:Date.now()})
})

app.get('/food/rating/:score', (req, res) => {
  var score = parseInt(req.params.score)
  var data = {
    score: req.params.score
  }
  res.render('feedback', data)

})

app.get('/food/notify', (req, res) => {
  slack.notifyRating((error, results) => {
    if (error) return res.status(400).json(error)

    res.status(200).json(results)
  })
})

app.get('/food/summary_rating', (req, res) => {
  slack.summaryRating((error, results) => {
    if (error) return res.status(400).json(error)

    res.status(200).json(results)
  })
})

app.get('/food/today', (req, res) => {
  Prefood.getFoodToday((error, food) => {
    if (error) return res.status(400).json(error)
    var imageList = fs.readdirSync('public/img/card')
    var cardImage = helper.randomArray(imageList)
    Setting.get('prefoodOwner', (error, prefoodOwner) => {
      if (error) return res.status(400).send({error: error.message})
      res.render('food_today', {food, cardImage, prefoodOwner, prefoodFacebookIds: config.prefoodFacebookIds})
    })
  })
})

app.get('/food/yesterday', (req, res) => {
  Prefood.getFoodYesterday((error, food) => {
    if (error) return res.status(400).json(error)
    var imageList = fs.readdirSync('public/img/card')
    cardImage = helper.randomArray(imageList)
    res.render('food_today', {food, cardImage})

  })
})

app.get('/food/:date', (req, res) => {
  Prefood.getFoodByDate(req.params.date, (error, food) => {
    if (error) return res.status(400).json(error)
    var imageList = fs.readdirSync('public/img/card')
    cardImage = helper.randomArray(imageList)
    res.render('food_today', {food, cardImage})

  })
})

app.get('/', (req, res) => {
  res.redirect('/food/today')
})

app.get('/leaderboard', (req,res) => {
  Prefood.getRanking((error, ranking) => {
    res.render('leaderboard', {ranking})

  })
})

app.get('/test', (req,res) => {
  Prefood.getRanking((error, ranking) => {
    console.log(ranking);
    res.render('test', {ranking})

  })
})

var port = process.env.PORT || 3002
app.listen(port, () => {
  console.log(`Prefood listening on ${port}`)
})
