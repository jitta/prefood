var config = {
  production: {
    mongodb: process.env.MONGO_URI,
    selfUrl: process.env.selfUrl,
    channel: '#wall',
    slackHookUrl: process.env.slackHookUrl
  },
  development: {
    mongodb: 'mongodb://localhost/prefood',
    selfUrl: 'http://localhost:3002',
    channel: '#testbot',
    slackHookUrl: 'https://hooks.slack.com/services/hook-url'
  }
}

module.exports = config[process.env.NODE_ENV || 'development']
