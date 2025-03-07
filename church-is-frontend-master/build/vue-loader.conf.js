// 'use strict'
// const utils = require('./utils')
// const config = require('../config')
// const isProduction = process.env.NODE_ENV === 'production'
// const sourceMapEnabled = isProduction
//   ? config.build.productionSourceMap
//   : config.dev.cssSourceMap

// module.exports = {
//   loaders: utils.cssLoaders({
//     sourceMap: sourceMapEnabled,
//     extract: isProduction
//   }),
//   cssSourceMap: sourceMapEnabled,
//   cacheBusting: config.dev.cacheBusting,
//   transformToRequire: {
//     video: ['src', 'poster'],
//     source: 'src',
//     img: 'src',
//     image: 'xlink:href'
//   }
// }


//updated code

'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProduction
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href',
    // add 'audio' for Vue 3 if your project includes audio elements
    audio: 'src'
  },
  // Vue 3 has a new syntax and other changes that require vue-loader 15+
  vueLoader: {
    compilerOptions: {
      // For Vue 3, enable the new features such as scoped slots and composition API
      isCustomElement: tag => tag.includes('my-custom-element')
    }
  }
}

