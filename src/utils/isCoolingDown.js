const isCoolingDown = (lastUpdatedOn) => {
  let currentTime = Date.now()
  let threshold = parseInt(process.env.COOLING_PERIOD_IN_HOURS) * 3600000
  console.log('currentTime - ', currentTime)
  console.log('Threshold - ', threshold)
  console.log('Last Updated - ', lastUpdatedOn)
  console.log('Total - ', lastUpdatedOn + threshold)
  if (lastUpdatedOn + threshold <= currentTime) {
    return true
  }
  return false
}

module.exports = { isCoolingDown }
