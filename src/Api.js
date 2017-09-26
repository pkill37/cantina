import fetchJsonp from 'fetch-jsonp'

export const API_URL = 'http://services.web.ua.pt/sas/ementas?date=day&format=jsonp'

export function menusAtOpenCanteens(menus) {
    return menus.filter(m => m.items.item !== {} && !m['@attributes'].disabled.startsWith('Encerrado'))
}

export function lunchMenus(menus) {
    return menus.filter(m => m['@attributes']['meal'] == 'Almoço')
}

export function dinnerMenus(menus) {
    return menus.filter(m => m['@attributes']['meal'] == 'Jantar')
}

export function parseApiResponse(response, ,,a) {
    const open = menusAtOpenCanteens(response.menus.menu)
    const menus = open.filter(m => m['@attributes']['meal'] === dinner ? 'Jantar' : 'Almoço')
    const map = new Map()

    for (const menu of menus) {
        map.set(menu['@attributes']['canteen'], menu.items.item.filter(e => typeof e === 'string'))
    }


}

export async function getJSONP(url) {
    try {
        const response = await fetchJsonp(url, { jsonpCallback: 'cb' })
        return await response.json()
    }
    catch (err) {
        console.error(err.message);
    }
}

