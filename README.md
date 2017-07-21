## Installation

```npm install npm-track```

## Usage

```app.use(require("npm-track"))```


## What happens?

This module will create a `Logs` folder, and a new JSON file for each month with the following data:
```
{
    21: {
        count: {
            "/": 12,
            "/index": 44,
            "otherroutes": 2
        },
        requests: [
            {
                "time": "2017-07-21T20:56:22.730Z",
                "params": {
                    foo: "bar"
                },
                "body": {},
                "method": "GET",
                "cookies": {},
                "ip": "1:1:1",
                "url": "/index",
                "fullUrl": "/index?foo=bar",
                "status": 200,
                "responseTime": 18
            },
            .
            .
            .
        ]
    },
    .
    .
    .
}
```
