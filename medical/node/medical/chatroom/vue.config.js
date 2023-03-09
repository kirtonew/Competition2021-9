module.exports = {
  publicPath: 'http://39.106.209.229:3100',
  devServer:{
    proxy: {
      '/api': {
        target: 'http://39.106.209.229:3100',
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  outputDir:__dirname + "/../service/chatroom",
  publicPath: process.env.NODE_ENV === 'production'? '/chatroom/' : '/'
}
