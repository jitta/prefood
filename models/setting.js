var mongoose = require('mongoose')
var moment = require('moment')
var Schema = mongoose.Schema

var settingSchema = Schema({
  key: {
    type: String,
    required : true
  },
  value: {
    type: Schema.Types.Mixed,
    required : true
  }
})

settingSchema.index({ key: 1}, { unique: true })

settingSchema.statics.set = function set (key, value, callback) {
  Setting.update({key}, {key, value}, {upsert: true}, callback)
}

settingSchema.statics.get = function get (key, callback) {
  this.findOne({key:key}).exec((error, result) => {
    if (error) return callback(error)
    callback(null, result && result.value)
  })
}

Setting = mongoose.model('setting', settingSchema)

module.exports = Setting
