const app = require('./app') // the actual Express application
const config = require('./utils/config')
const logger = require('./utils/logger')

const PORT = config.PORT || 3001
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})


//https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-1