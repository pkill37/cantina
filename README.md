# cantina

Stupid web application that checks if the next meal's food at the University of Aveiro's canteens is good.

[https://fabiomaia.github.io/cantina/](https://fabiomaia.github.io/cantina/)

![cantina](http://i.imgur.com/nOzZbIq.png)

## Problem

Cross-domain AJAX requests are forbidden in the browser by the [same-origin security policy](https://en.wikipedia.org/wiki/Same-origin_policy). The API made available by the university does not allow cross-origin requests via CORS, so I can't just directly hit the API from the browser. Furthermore, since the university's API is served over HTTP, serving this application over HTTPS would throw mixed-content errors in most modern browsers.

## Solutions

### CORS

One solution is to run a proxy server-side that hits the API for me and serve it over HTTPS on an endpoint that accepts CORS requests. However, this requires a budget for server bills as well as maintenance upkeep to ensure the proxy is still running, which I am not willing to provide for such a stupid application.

There are [CORS proxies available as a service](https://gist.github.com/jimmywarting/ac1be6ea0297c16c477e17f8fbe51347) that will proxy our request and serve it over HTTPS and CORS for free. In practice this means that instead of requesting

```
http://services.web.ua.pt/sas/ementas?date=day&format=json
```

we can instead simply request

```
https://cors.io/?http://services.web.ua.pt/sas/ementas?date=day&format=json
```

CORS is the modern and recommended solution to the same-origin security policy, unless you need to support browsers invented before CORS, in which case you can resort to JSONP.

### JSONP

Alternatively JSONP is an older technique that precedes CORS that is useful in rare scenarios where you need to support old browsers and only need to mimic read-only `GET` requests (not `POST` or `PUT` which it inherently cannot do).

Fundamentally it takes advantage of the fact that you *can* always embed arbitrary cross-domain scripts in a page, e.g.

```
<script src="http://services.web.ua.pt/sas/ementas?date=day&format=jsonp&cb=f"></script>
```

If instead of a typical JSON-encoded HTTP response like

```
{"@attributes":{"request":"\/sas\/ementas","request_timestamp":"1564579826"},"menus":{"@attributes":{"zone":"santiago","type":"day"},"menu":[{"@attributes":{"canteen":"Refeit\u00f3rio de Santiago","meal":"Almo\u00e7o","date":"Wed, 31 Jul 2019 14:30:01 +0100","weekday":"Wednesday","weekdayNr":"3","disabled":"Encerrado - refei\u00e7\u00f5es servidas no refeit\u00f3rio do crasto"},"items":{}},{"@attributes":{"canteen":"Refeit\u00f3rio de Santiago","meal":"Jantar","date":"Wed, 31 Jul 2019 14:30:01 +0100","weekday":"Wednesday","weekdayNr":"3","disabled":"Encerrado - refei\u00e7\u00f5es servidas no refeit\u00f3rio do crasto"},"items":{}},{"@attributes":{"canteen":"Refeit\u00f3rio do Crasto","meal":"Almo\u00e7o","date":"Wed, 31 Jul 2019 14:30:01 +0100","weekday":"Wednesday","weekdayNr":"3","disabled":"0"},"items":{"item":["Sopa de nabi\u00e7as","Bife de peru grelhado e batata cozida","Arroz de marisco","Cozido simples","Badejo cozido com batata cozida e feij\u00e3o verde","Fruta da \u00e9poca ou doce","Buffet de saladas",{"@attributes":{"name":"Diversos"}},"P\u00e3o de mistura"]}},{"@attributes":{"canteen":"Refeit\u00f3rio do Crasto","meal":"Jantar","date":"Wed, 31 Jul 2019 14:30:01 +0100","weekday":"Wednesday","weekdayNr":"3","disabled":"0"},"items":{"item":["Sopa de nabi\u00e7as","Frango estufado com arroz de ervilhas",{"@attributes":{"name":"Prato normal peixe"}},"Seitan de cebolada",{"@attributes":{"name":"Prato vegetariano"}},{"@attributes":{"name":"Prato op\u00e7\u00e3o"}},"Buffet de saladas","P\u00e3o de mistura","Fruta da \u00e9poca ou doce"]}},{"@attributes":{"canteen":"Snack-Bar\/Self","meal":"Almo\u00e7o","date":"Wed, 31 Jul 2019 14:30:01 +0100","weekday":"Wednesday","weekdayNr":"3","disabled":"0"},"items":{"item":["Sopa de nabi\u00e7as","Arroz de aves","Espadarte grelhado com molho de mostarda e batata cozida","Buffet de saladas","Cozido simples","Fruta da \u00e9poca ou doce",{"@attributes":{"name":"Bebida"}}]}}]}})
```

the remote server instead wraps up the HTTP response in a callback function `f` (presumably defined before the embedded script is run) such that it forms valid JavaScript code

```
f({"@attributes":{"request":"\/sas\/ementas","request_timestamp":"1564579826"},"menus":{"@attributes":{"zone":"santiago","type":"day"},"menu":[{"@attributes":{"canteen":"Refeit\u00f3rio de Santiago","meal":"Almo\u00e7o","date":"Wed, 31 Jul 2019 14:30:01 +0100","weekday":"Wednesday","weekdayNr":"3","disabled":"Encerrado - refei\u00e7\u00f5es servidas no refeit\u00f3rio do crasto"},"items":{}},{"@attributes":{"canteen":"Refeit\u00f3rio de Santiago","meal":"Jantar","date":"Wed, 31 Jul 2019 14:30:01 +0100","weekday":"Wednesday","weekdayNr":"3","disabled":"Encerrado - refei\u00e7\u00f5es servidas no refeit\u00f3rio do crasto"},"items":{}},{"@attributes":{"canteen":"Refeit\u00f3rio do Crasto","meal":"Almo\u00e7o","date":"Wed, 31 Jul 2019 14:30:01 +0100","weekday":"Wednesday","weekdayNr":"3","disabled":"0"},"items":{"item":["Sopa de nabi\u00e7as","Bife de peru grelhado e batata cozida","Arroz de marisco","Cozido simples","Badejo cozido com batata cozida e feij\u00e3o verde","Fruta da \u00e9poca ou doce","Buffet de saladas",{"@attributes":{"name":"Diversos"}},"P\u00e3o de mistura"]}},{"@attributes":{"canteen":"Refeit\u00f3rio do Crasto","meal":"Jantar","date":"Wed, 31 Jul 2019 14:30:01 +0100","weekday":"Wednesday","weekdayNr":"3","disabled":"0"},"items":{"item":["Sopa de nabi\u00e7as","Frango estufado com arroz de ervilhas",{"@attributes":{"name":"Prato normal peixe"}},"Seitan de cebolada",{"@attributes":{"name":"Prato vegetariano"}},{"@attributes":{"name":"Prato op\u00e7\u00e3o"}},"Buffet de saladas","P\u00e3o de mistura","Fruta da \u00e9poca ou doce"]}},{"@attributes":{"canteen":"Snack-Bar\/Self","meal":"Almo\u00e7o","date":"Wed, 31 Jul 2019 14:30:01 +0100","weekday":"Wednesday","weekdayNr":"3","disabled":"0"},"items":{"item":["Sopa de nabi\u00e7as","Arroz de aves","Espadarte grelhado com molho de mostarda e batata cozida","Buffet de saladas","Cozido simples","Fruta da \u00e9poca ou doce",{"@attributes":{"name":"Bebida"}}]}}]}})
```

then one can embed the script `<script src="http://services.web.ua.pt/sas/ementas?date=day&format=jsonp&cb=f"></script>` which will trigger the `f` function call (with the data that we wanted to obtain) which can finally process the data arbitrarily. In essence this is equivalent to requesting the resource as originally intended, and is effectively circumnavigating the same-origin security policy.

Programatically,

```javascript
function getJSONP(url, param, cb) {
    const script = document.createElement('script')
    script.src = `${url}&${param}=${cb.name}`
    document.querySelector('head').appendChild(script)
}
```

Embedded scripts are likely to be cached by the browser though. You may want to force a fresh request each time by appending something unique to the query string (e.g. the current Unix timestamp) to invalidate the cache.

```javascript
function getJSONP(url, param, cb) {
    const script = document.createElement('script')
    script.src = `${url}&${param}=${cb.name}&v=${Date.now()}`
    document.querySelector('head').appendChild(script)
}
```
