var fs = require("fs")
var path = require("path")
var curPath = process.cwd()
module.exports = function (req, res, next) {
    req.start = new Date()
    try {
        req.on("end", function () {
            CheckDir({
                time: new Date(),
                params: req.params,
                body: req.body,
                method: req.method,
                cookies: req.cookies,
                ip: req.ip,
                url: req.baseUrl + req.path,
                fullUrl: req.originalUrl,
                status: res.statusCode,
                responseTime: (new Date() - req.start)
            })
        })
    } catch (err) {
        console.log(err)
    }
    next()
}

function CheckDir(obj) {
    fs.access(curPath + "/Logs", function (err) {
        if (err) {
            fs.mkdir(curPath + "/Logs", function (err) {
                if (err) console.log(err)
                CheckFile(obj)
            })
        } else CheckFile(obj)
    })
}

function CheckFile(obj) {
    var now = new Date()
    var year = now.getFullYear(),
        month = now.getMonth()

    var filename = [year, month].join("-") + ".json"
    fs.access(curPath + "/Logs/" + filename, function (err) {
        if (err) {
            fs.writeFile(curPath + "/Logs/" + filename, "{}", function (err) {
                if (err) console.log(err)
                LogData(obj, {}, curPath + "/Logs/" + filename)
            })
        } else {
            fs.readFile(curPath + "/Logs/" + filename, function (err, data) {
                if (err) console.log(err)
                LogData(obj, JSON.parse(data), curPath + "/Logs/" + filename)
            })
        }
    })
}

function LogData(obj, json, filename) {
    var day = (new Date()).getDate()

    if (!json[day]) {
        json[day] = {
            count: {},
            requests: []
        }
    }

    var temp = json[day]

    temp.requests.push(obj)
    if (!temp.count[obj.url]) {
        temp.count[obj.url] = 0
    }
    temp.count[obj.url]++;

    WriteFile(JSON.stringify(json), filename)
}

function WriteFile(json, filename) {
    fs.writeFile(filename, json, function (err) {
        if (err) console.log(err)
    })
}
