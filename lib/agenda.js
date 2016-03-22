var Agenda = require('agenda')
var config = require('../config')
var slack = require('./slack')
var agenda = new Agenda({db: {address: config.mongodb}}, (error) => {
  agenda._db = agenda._collection;
})

agenda.define('rating food on slack', function(job, done) {
  slack.notifyRating(done)
})

agenda.define('summary food on slack', function(job, done) {
  slack.summaryRating(done)
})

agenda.on('ready', function() {
  agenda.every('30 6 * * 2-6', 'rating food on slack')
  agenda.every('0 10 * * 2-6', 'summary food on slack')
  agenda.start()

})


module.exports = agenda
