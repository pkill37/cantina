# cantina

Stupid web application that checks if the next meal's food at my university's canteens is good.

[https://fabiomaia.github.io/cantina/](https://fabiomaia.github.io/cantina/)

![cantina](http://i.imgur.com/nOzZbIq.png)

## CORS

Cross-domain AJAX requests are forbidden in the browser by the [same-origin security policy](https://en.wikipedia.org/wiki/Same-origin_policy). The API made available by the university does not allow cross-origin requests via CORS, so I can't just directly hit the API from the browser. Furthermore, since the university's API is served over HTTP, if I served this application over HTTPS most modern browsers would throw mixed-content errors.

Clearly one solution is to have a proxy hit the API for me in and serve it over HTTPS on an endpoint that accepts CORS requests. However, this requires a budget for server bills as well as maintenance upkeep to ensure the proxy is still running, which I was not willing to provide for such a stupid application.

Luckily there are [CORS proxies available as a service](https://gist.github.com/jimmywarting/ac1be6ea0297c16c477e17f8fbe51347) that do this for free. In practice this means that instead of requesting

```
http://services.web.ua.pt/sas/ementas?date=day&format=json
```

one instead simply requests

```
https://cors.io/?http://services.web.ua.pt/sas/ementas?date=day&format=json
```

## JSONP

Alternatively, JSONP is a clever hack that basically wraps up an HTTP response in a callback function such that it forms valid JavaScript code. It then takes advantage of the fact that you *can* embed arbitrary cross-domain scripts in a page to execute the embedded callback function. In essence this is equivalent to requesting the resource as originally intended, and is effectively circumnavigating the same-origin security policy.

```javascript
function getJSONP(url, param, cb) {
    const script = document.createElement('script')
    script.src = `${url}&${param}=${cb.name}`
    document.querySelector('head').appendChild(script)
}
```

Embedded scripts are likely to be cached by the browser though. You may want to force a fresh request each time by appending something unique to the query string (e.g. the current UNIX timestamp) to invalidate the cache.

```javascript
function getJSONP(url, param, cb) {
    const script = document.createElement('script')
    script.src = `${url}&${param}=${cb.name}&v=${Date.now()}`
    document.querySelector('head').appendChild(script)
}
```
