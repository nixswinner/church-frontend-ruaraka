// 'use strict'
// const merge = require('webpack-merge')
// const prodEnv = require('./prod.env')

// module.exports = merge(prodEnv, {
//   NODE_ENV: '"development"',
//   BASE_URL: '"http://127.0.0.1:8000"'
// })



//updated codebase
'use strict'
const { merge } = require('webpack-merge') // Ensure modern import
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: JSON.stringify('development'),
  BASE_URL: JSON.stringify('http://127.0.0.1:8000')
})

