const fs = require('fs');
const express = require('express');
const preDeploy = require('./public/preDeploy.js');
const app = express();

const hostPublic = require('./public/index.js')
var site = process.env.SITE_URL || 'https://adarshrkumar.dev'
var shortnerUrl = process.env.SHORTNER_URL || 'https://akum.site'

app.get('/', function(req, res) {
    let h = req.hostname
    if (h.endsWith('.repl.co') || h.endsWith('.replit.dev')) {
        preDeploy()
        res.sendFile(`${__dirname}/index.html`)
    }
    else {
        res.redirect(site)
    }
});

app.get('/shortnerUrl', function(_, res) {
    res.send(shortnerUrl)
})

app.post('/addUrl', function(req, res) {
    var data = fs.readFileSync('data.json')
    if (!!JSON.parse(data) === false) data = '{}'
    data = JSON.parse(data)
    
    // Decode URL parameters to handle encoded URLs
    let alias = decodeURIComponent(req.query.a).toLowerCase()
    const url = decodeURIComponent(req.query.u)
    
    // Ensure alias starts with /
    if (!alias.startsWith('/')) alias = `/${alias}`
    
    data[alias] = url
    fs.writeFileSync('data.json', JSON.stringify(data))

    res.send('Succesfully created a short URL at')
    
    // Successfully / Unsuccessfully
})

hostPublic(app)

app.get('/*', function(req, res) {
    var data = fs.readFileSync('data.json')
    if (!!JSON.parse(data) === false) data = '{}'
    data = JSON.parse(data)

    var url = data[req.path.toLowerCase()]
    if (!!url && url !== null) {
        // Preserve query parameters when redirecting
        if (Object.keys(req.query).length > 0) {
            const queryString = new URLSearchParams(req.query).toString()
            url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`
        }
        res.redirect(url)
    }
    else {
        var theSite = site
        if (theSite.includes('://')) {
            theSite = theSite.split('://')[1]
        }
        url = `${req.protocol}://${theSite}/${req.path}`
        if (url.includes('//')) url = url.split('//').join('/')
        
        // Preserve query parameters for fallback redirect
        if (Object.keys(req.query).length > 0) {
            const queryString = new URLSearchParams(req.query).toString()
            url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`
        }
        res.redirect(url)
    }

    // Successfully / Unsuccessfully
})

app.listen(3000, function() {
    console.log('URL Shortner listening on port 3000!');
});