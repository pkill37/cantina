# cantina

Stupid web application that checks if the next meal's food at my university's canteens is good.

[http://cantina.surge.sh/](http://cantina.surge.sh/)

![cantina](http://i.imgur.com/nOzZbIq.png)

## JSONP

Cross-domain AJAX requests are forbidden in the browser by the [same-origin security policy](https://en.wikipedia.org/wiki/Same-origin_policy). The API offered by the university does not allow cross-origin requests via CORS, so I can't easily hit the API from the browser. I could have set up a reverse proxy to hit the API for me, but I didn't really want to have to maintain a server.

For the sake of keeping this running self-hosted for free, I resorted to JSONP which is a clever hack that basically wraps up a response in a callback function such that it forms valid JavaScript code. It then takes advantage of the fact that you can embed arbitrary cross-domain scripts in a page to execute the given callback function, which is equivalent to requesting the resource as intended.

```javascript
function getJSONP(url, param, cb) {
    const script = document.createElement('script')
    script.src = `${url}&${param}=${cb.name}`
    document.querySelector('head').appendChild(script)
}
```

Embedded scripts are likely to be cached by the browser though. You may want to force a fresh request each time by appending something unique to the query string (e.g. the current UNIX timestamp).

```javascript
function getJSONP(url, param, cb) {
    const script = document.createElement('script')
    script.src = `${url}&${param}=${cb.name}&v=${Date.now()}`
    document.querySelector('head').appendChild(script)
}
```

## Deployment

Ideally I would like to host this on GitHub Pages, but their traffic runs over HTTPS and the API I'm using is still plain HTTP, which throws mixed-content errors in modern browsers, so I'm using [surge.sh](https://surge.sh) as an alternative.

```
$ surge
```

