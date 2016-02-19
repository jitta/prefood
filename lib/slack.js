Slack = require('node-slackr')
config = require('../config')
Prefood = require('../models/prefood')
const foo = () =>{}

slack = new Slack(config.slackHookUrl, {
  channel: config.channel,
  username: "Prefood",
  icon_emoji: ":curry:"
})

const notifyRating = (callback) => {
  if (!callback) {callback = foo}
  var messages = {
    text: "*** <!here|here> ขอคะแนนสำหรับข้าวกลางวันด้วยจ้าาาา ***",
    attachments: [
      {
        color: "#0F8140",
        fields: [
          {
            value: `<${config.selfUrl}/food/rating/5|✩ ✩ ✩ ✩ ✩>`
          }
        ]
      },
      {
        color: "#97C93C",
        fields: [
          {
            value: `<${config.selfUrl}/food/rating/4|✩ ✩ ✩ ✩>`,
            short: false
          }
        ]
      },
      {
        color: "#FDCB08",
        fields: [
          {
            value: `<${config.selfUrl}/food/rating/3|✩ ✩ ✩>`,
            short: false
          }
        ]
      },
      {
        color: "#F8991C",
        fields: [
          {
            value: `<${config.selfUrl}/food/rating/2|✩ ✩>`,
            short: false
          }
        ]
      },
      {
        color: "#ED2124",
        fields: [
          {
            value: `<${config.selfUrl}/food/rating/1|✩>`,
            short: false
          }
        ]
      }
    ]
  }

  slack.notify(messages, callback)

}

const summaryRating = (callback) => {
  if(!callback) {callback = foo}
  Prefood.getFoodToday((error, food) => {
    if (error) return callback(error)

    feedbackList = {}
    food.ratings.forEach((item, index) => {
      for (type of Object.keys(item.feedback)) {
        if(item.feedback[type] && item.feedback[type].length > 2) {
          if (!feedbackList[type]) feedbackList[type] = []
          feedbackList[type].push(item.feedback[type])
        }
        if(index == food.ratings.length - 1) feedbackList[type] = feedbackList[type].join('\n')
      }
    })

    var messages = {
      text: "*** ผลสรุปความอร่อยของอาหารวันนี้ออกมาแล้วจ้า ***",
      attachments: [
        {
          mrkdwn_in: ["pretext", "text", "fields"],
          fields: [
            {
              value: `Total *${food.ratings.length}* people rating\nAverage rating: *${food.averageRating}*`
            },
            {
              title:'Food name',
              value: feedbackList.foodName
            },
            {
              title:'What went well?',
              value: feedbackList.good
            },
            {
              title:'What didn\'t go so well?',
              value: feedbackList.bad
            },
            {
              title:'What can do better next time?',
              value: feedbackList.improve
            }
          ]
        }
      ]
    }
    slack.notify(messages, callback)

  })
}

module.exports.notifyRating = notifyRating
module.exports.summaryRating = summaryRating
