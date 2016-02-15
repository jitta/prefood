Slack = require('node-slackr')
config = require('./config')

slack = new Slack(config.slackHookUrl, {
  channel: config.channel,
  username: "Prefood",
  icon_emoji: ":curry:"
})

const notifyRating = () => {
  messages = {
    text: "*** <!channel|channel> ขอคะแนนสำหรับข้าวกลางวันด้วยจ้าาาา ***",
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
  };
  slack.notify(messages, (error, results) => {
    console.log(error, results);
  })

}
module.exports.notifyRating = notifyRating
