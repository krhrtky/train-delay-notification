'use strict';
const { schedule } = require('node-cron')
const notifier = require('node-notifier')
const trainDelayFinder = require('./index')
const getDelays = async () => {
  const result = await trainDelayFinder();

  if (result.length === 0) {
    notifier.notify({
      title: '遅延情報',
      message: '現在、遅延はありません。'
    })
  } else {

    result.forEach(delay => {
      notifier.notify({
        title: '遅延情報',
        message: `[${delay.line}] ${delay.description}`
      })
    })
  }
}

schedule('*/10 * * * * *', getDelays, null)
