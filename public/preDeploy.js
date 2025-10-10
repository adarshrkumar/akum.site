var fName = 'data'
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));var fs = require('fs');

function parseJSON(response) {
    let a;
    try {
        a = JSON.parse(response);
    } catch (e) {
        return '{}'
    }
    return a
}

preDeploy()
function preDeploy() {
    fetch(`https://akum.site/public/${fName}.json`)
        .then(resp => resp.text())
        .then(body => {
            fs.writeFileSync(`${__dirname}/${fName}.json`, parseJSON(body) ?? '{}')
        })
}

module.exports = preDeploy