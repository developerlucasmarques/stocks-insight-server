export default {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'jest'
    },
    binary: {
      version: '6.2.0',
      skipMD5: true
    },
    autoStart: false
  }
}
