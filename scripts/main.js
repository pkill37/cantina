function getJSON(url, cb) {
    const request = new XMLHttpRequest()
    request.open('GET', url, true)

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            cb(JSON.parse(request.responseText))
        }
    }

    request.send()
}

function getJSONP(url, param, cb) {
    const script = document.createElement('script')
    script.src = `${url}&${param}=${cb.name}`
    document.querySelector('head').appendChild(script)
}

function isInterestedInDinner() {
    return new Date().getHours() >= 14
}

function validMenus(menus) {
    return menus.filter(m => m.items.item != {} && !m['@attributes'].disabled.startsWith('Encerrado'))
}

function lunchMenus(menus) {
    return menus.filter(m => m['@attributes']['meal'] == 'Almoço')
}

function dinnerMenus(menus) {
    return menus.filter(m => m['@attributes']['meal'] == 'Jantar')
}

function parseResponse(response) {
    menus = validMenus(response.menus.menu)
    menus = isInterestedInDinner() ? lunchMenus(menus) : dinnerMenus(menus)

    const map = new Map()

    for (const menu of menus) {
        map.set(menu['@attributes']['canteen'], menu.items.item.filter(e => typeof e === 'string'))
    }

    return map
}

function updateAnswer(response) {
    const menus = parseResponse(response)
    const best = bestMenu(menus)

    if (best) {
        const answer = document.querySelector('#answer')
        answer.textContent = 'Sim.'
        answer.classList.remove('negative')
        answer.classList.add('positive')

        const canteen = document.querySelector('#canteen')
        canteen.textContent = `ao ${best.canteen}`

        const meal = document.querySelector('#meal')
        meal.textContent = `${best.meal.toLowerCase()}.`
    }
}

function bestMenu(menus) {
    // TODO: reorder to give priority to some meals
    const good = ['frango', 'lombo', 'bacalhau com natas', 'porco', 'grelhada mista', 'rojões', 'frita']

    for (const [canteen, meals] of menus) {
        for (const meal of meals) {
            for (const g of good) {
                if (meal.toLowerCase().includes(g)) {
                    return {canteen, meal}
                }
            }
        }
    }

    return null
}

const url = 'http://services.web.ua.pt/sas/ementas?date=day&format=jsonp'
getJSONP(url, 'cb', updateAnswer)
