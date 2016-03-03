var mongoose = require('mongoose')
var moment = require('moment')
var Setting = require('./setting')
var config = require('../config')

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
    prefood: mongoose.Schema({
      fid: String,
      name: String
    }),
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
  this.findOne(criteria, (error, foodToday) => {
    if (error) return callback(error)
    Setting.get('prefoodOwner', (error, prefoodOwner) => {
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
      // Create new record
      if (!foodToday) {
        var now = new Date()
        var food = new Prefood({
          prefood: prefoodOwner,
          foodName: data.food_name,
          cookedDate: now,
          createdDate: now,
          averageRating: rating.score,
          totalRatings: rating.score,
          ratings: [ rating ]
        })
        food.save(callback)
      } else { // Update exist record
        foodToday.ratings.push(rating)
        foodToday.foodTodayName = data.foodToday_name
        foodToday.totalRatings += rating.score
        foodToday.averageRating = (foodToday.totalRatings / foodToday.ratings.length).toFixed(2)
        foodToday.updatedDate = new Date()
        foodToday.save(callback)
      }
    })
  })
}

prefoodSchema.statics.getFoodToday = function getFoodToday(callback) {
  var nowDate = new Date().toDateString()
  var criteria = {
    cookedDate: {
      $gte: nowDate
    }
  }
  this.findOne(criteria).exec(callback)
}

prefoodSchema.statics.getFoodByDate = function getFoodByDate(date, callback) {
  var startDate = moment(new Date(date)).toDate()
  var endDate = moment(endDate).add(1,'days').toDate()
  var criteria = {
    cookedDate: {
      $gte: startDate,
      $lt: endDate
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

prefoodSchema.statics.changeTodayPrefood = function changeTodayPrefood(fid, callback) {
  var prefoodFacebookIds = config.prefoodFacebookIds
  var fids = _.values(prefoodFacebookIds)
  var hasPrefoodList = _.includes(fids, fid)
  if (hasPrefoodList) {
    var name = _.findKey(prefoodFacebookIds, (val) => val == fid)
    var prefoodValue = {
      fid: fid,
      name: name
    }
    Setting.set('prefoodOwner', prefoodValue, (error, results) => {
      if (error) return callback(error)
      Prefood.getFoodToday((error, food) => {
        if (error) return callback(error)
        food.prefood = prefoodValue
        food.save((error, result) => {
          if (error) return callback(error)
          callback(null, results)
        })
      })
    })
  } else {
    callback(null, new Error(`Not found prefood facebood id for ${fid}`))
  }
}



Prefood = mongoose.model('prefood', prefoodSchema)
module.exports = Prefood
