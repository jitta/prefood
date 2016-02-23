var mongoose = require('mongoose')
var config = require('../config')

mongoose.connect(config.mongodb)

var ratingSchema = mongoose.Schema({
  score: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: {
    good: String,
    bad: String,
    improve: String,
    foodName: String
  }
},{_id: false})

var prefoodSchema = mongoose.Schema({
    cookedDate: {
      type: Date
    },
    createdDate: {
      type: Date,
      defaults: Date.now
    },
    updatedDate: {
      type: Date,
      defaults: Date.now
    },
    foodName: {
      type: String
    },
    averageRating: {
      type: Number
    },
    totalRatings: {
      type: Number
    },
    ratings: [ratingSchema]

})

prefoodSchema.statics.rateFood = function rateFood (data, callback) {
  var nowDate = new Date().toDateString()
  var criteria = {
    cookedDate: {
      $gte: nowDate
    }
  }
  this.count(criteria, (error, total) => {
    if (error) return callback(error)
    var rating = {
      score: parseInt(data.score),
      feedback: {
        good: data.feedback_good,
        bad: data.feedback_bad,
        improve: data.feedback_improve,
        foodName: data.food_name
      }
    }

    if (total === 0) {
      var now = new Date()
      var food = new Prefood({
        cookedDate: now,
        createdDate: now,
        averageRating: rating.score,
        totalRatings: rating.score,
        ratings: [ rating ]
      })
      food.save(callback)
    } else {
      this.findOne(criteria).exec((error, result) => {
        if (error) return callback(error)
        result.ratings.push(rating)
        result.totalRatings += rating.score
        result.averageRating = (result.totalRatings / result.ratings.length).toFixed(2)
        result.updatedDate = new Date()
        result.save(callback)
      })
    }
  })
}

prefoodSchema.statics.getFoodToday = function getFoodToday(callback) {
  var nowDate = new Date().toDateString()
  var criteria = {
    cookedDate: {
      $gte: nowDate
    }
  }
  this.findOne(criteria).lean().exec(callback)

}

prefoodSchema.statics.getFoodYesterday = function getFoodYesterday(callback) {
  this.find().sort({cookedDate:-1}).limit(2).lean().exec((error, results) => {
    if(error) return callback(error)
    if(results && results.length > 1) {
      return callback(null, results[1])
    }

    return callback()
  })

}

prefoodSchema.statics.getRanking = function getRanking(callback) {
  var projection = {
    cookedDate: 1,
    averageRating: 1,
    foodName: 1
  }
  this.find().select(projection).sort('-averageRating').lean().exec(callback)

}

Prefood = mongoose.model('prefood', prefoodSchema)
module.exports = Prefood
