const fs = require('fs');
var path = 'public'
var smallPath = path[0]

function hostPublic(app) {
  app.get(`/${path}`, function(_, res) {
    res.redirect(`/${path}/create`)
  });
  
  app.get(`/${path}/data.json` , function(_, res) {
    res.sendFile(`${__dirname}/data.json`)
  });
  
  app.get(`/${path}/create`, function(_, res) {
    res.sendFile(`${__dirname}/create.html`)
  })

  app.post(`/${path}/addUrl`, function(req, res) {
    var data = fs.readFileSync(`${__dirname}/data.json`)
    if (!!JSON.parse(data) === false) data = '{}'
    data = JSON.parse(data)
    var message = 'Succesfully created a short URL at'
    if (!!data[req.query.a.toLowerCase()]) {
      message = 'URL already exists at'
    }
    else {
      data[req.query.a.toLowerCase()] = req.query.u
    }
    fs.writeFileSync(`${__dirname}/data.json`, JSON.stringify(data))

    res.send(message)

    // Successfully / Unsuccessfully
  })

  app.get(`/${smallPath}/*`, function(req, res) {
    var data = fs.readFileSync(`${__dirname}/data.json`, 'utf-8')
    if (!!JSON.parse(data) === false) data = '{}'
    data = JSON.parse(data)

    var requestedPath = req.path.toLowerCase()
    if (requestedPath.startsWith(`/${smallPath}`)) {
      requestedPath = requestedPath.substring(1 + smallPath.length)
    }
    var url = data[requestedPath]
    if (!!url && url !== null) {
      res.redirect(url)
    }
    else {
      var dName = __dirname
      if (dName.includes(path)) {
        dName = dName.replace(`/${path}/`, '/')
      }
      res.status(404).sendFile(`${dName}/404.html`)
    }

    // Successfully / Unsuccessfully
  })
}

module.exports = hostPublic