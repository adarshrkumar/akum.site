var fName = 'data'
var request = require('request');
var fs = require('fs');

preDeploy()
function preDeploy() {
  request.get(
    {
      url: `https://akum.site/public/${fName}.json`
    }, 
    function(error, response, body) {
      body = body ? body : '{}'
      fs.writeFileSync(`${__dirname}/${fName}.json`, body)
    }
  )
}

module.exports = preDeploy