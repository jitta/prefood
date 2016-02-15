var express = require('express')
var fs = require('fs')
var app = express()
var Prefood = require('./models/prefood')
var slack = require('./slack')
var helper = require('./lib/helper')
var bodyParser = require('body-parser')

app.set('view engine', 'jade')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static('public'))

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
  slack.notifyRating()
  res.status(200).send('OK')
})

app.get('/food/today', (req, res) => {
  Prefood.getFoodToday((error, food) => {
    if (error) return res.status(400).json(error)
    var imageList = fs.readdirSync('public/img/card')
    cardImage = helper.randomArray(imageList)
    res.render('food_today', {food, cardImage})

  })
})

app.get('/', (req, res) => {
  res.redirect('/food/today')
})

var port = process.env.PORT || 3002
app.listen(port, () => {
  console.log(`Prefood listening on ${port}`)
})
