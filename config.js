_ = require('lodash')

var config = {
  defaults: {
    prefoodFacebookIds: {
      'Benz': '100000185304733',
      'Book' : '100000160060555',
      'Good': '616236141',
      'Kao' : '1070600293',
      'Khame': '100000335452062',
      'Neng' : '1016968028',
      'Nut': '1167272050',
      'Paul': '695504915'
    }
  },
  production: {
    mongodb: process.env.MONGO_URI,
    selfUrl: process.env.selfUrl,
    channel: '#wall',
    slackHookUrl: process.env.slackHookUrl
  },
  development: {
    mongodb: 'mongodb://localhost/prefood',
    mongodb: 'mongodb://heroku_l4z4jfs3:unfp5chu85rhq7klsqc3aespms@ds059115.mongolab.com:59115/heroku_l4z4jfs3',
    selfUrl: 'http://localhost:3002',
    channel: '#testbot',
    slackHookUrl: 'https://hooks.slack.com/services/hook-url'
  }
}

env = process.env.NODE_ENV || 'development'
module.exports = _.merge(config[env], config['defaults'])
