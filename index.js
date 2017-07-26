var fs = require("fs"),
    curPath = "",
    dirPath = curPath + "Logs",
    obj = {},
    filename, filepath

UpdateFileName()

CheckDir(function () {
    fs.readFile(filepath, function (err, data) {
        if (err) {
            obj = {
                id: filename.split(".")[0]
            }
        } else obj = JSON.parse(data)
    })
})



module.exports = function (req, res, next) {
    req.start = new Date()
    req.on("end", function () {
        LogData({
            time: new Date(),
            params: req.params,
            query: req.query,
            body: req.body,
            method: req.method,
            cookies: req.cookies,
            ip: req.ip,
            url: req.baseUrl + req.path,
            fullUrl: req.originalUrl,
            status: res.statusCode,
            responseTime: (new Date() - req.start),
            route: req.route ? req.route.path : req.route
        })
    })
    UpdateFileName()
    next()
}

function CheckDir(callback) {
    fs.access(dirPath, function (err) {
        if (err) {
            fs.mkdir(dirPath, function (err) {
                if (err) console.log(err)
                else callback()
            })
        } else callback()
    })
}

function WriteFile() {
    fs.writeFile(filepath, JSON.stringify(obj), function (err) {
        if (err) console.log("npm-track", err)
    })
}

function LogData(data) {
    var day = (new Date()).getDate()

    if (!obj[day]) {
        obj[day] = {
            count: {},
            requests: []
        }
    }

    var temp = obj[day]

    temp.requests.push(data)
    var url = data.route || data.url
    if (!temp.count[url]) {
        temp.count[url] = 0
    }
    temp.count[url]++;

    WriteFile()
}

function UpdateFileName() {
    var now = new Date(),
        year = now.getFullYear(),
        month = now.getMonth()
    filename = [year, month].join("-") + ".json"
    filepath = [dirPath, filename].join("/")
}
