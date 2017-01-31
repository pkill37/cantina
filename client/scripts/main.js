function getJSON(url, cb) {
    const request = new XMLHttpRequest()
    request.open('GET', url, true)

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            const response = JSON.parse(request.responseText)
            console.log(response)
            cb(response)
        }
    }

    request.send()
}

function updateAnswer(response) {
    const answer = document.querySelector('#answer')
    answer.textContent = 'Sim'
}

const url = 'http://0.0.0.0:1337/api'
getJSON(url, updateAnswer)
