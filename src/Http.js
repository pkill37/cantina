export const getJSON = (url, cb) => {
    const request = new XMLHttpRequest()
    request.open('GET', url, true)

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            cb(JSON.parse(request.responseText))
        }
    }

    request.send()
}

export const getJSONP = (url, param, cb) => {
    const script = document.createElement('script')
    script.src = `${url}&${param}=${cb.name}&v=${Date.now()}`
    document.querySelector('head').appendChild(script)
}

