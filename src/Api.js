import fetchJsonp from 'fetch-jsonp'
import Option from './Option'
import Food from './Food'

export const API_URL = 'http://services.web.ua.pt/sas/ementas?date=day&format=jsonp'

export function parseApiResponse(response, dinner = 'dinner') {
    const open = response.menus.menu.filter(m => m.items.item !== {} && !m['@attributes'].disabled.startsWith('Encerrado'))
    const menus = open.filter(m => m['@attributes']['meal'] === dinner ? 'Jantar' : 'Almoço')
    const options = []
    
    let f = (food) => food === 'string' ? new Food(food) : null

    for (const menu of menus) {
        const items = menu.items.item
        const foods = {
            'Sopa': f(items[0]),
            'Prato Carne': f(items[1]),
            'Prato Peixe': f(items[2]),
            'Prato Dieta': f(items[3]),
            'Prato Vegetariano': f(items[4]),
            'Prato Opção': f(items[5]),
            'Salada': f(items[6]),
            'Diversos': f(items[7]),
            'Sobremesa': f(items[8]),
            'Bebida': f(items[9]),
        }
        options.push(new Option(menu['@attributes']['canteen'], foods))
    }
    
    // Sort by total likes
    options.sort((o1, o2) => Object.values(o1.foods).filter(f => f).reduce((acc, val) => acc + val.likes) - Object.values(o2.foods).filter(f => f).reduce((acc, val) => acc + val.likes))

    return options
}

export async function getJSONP(url) {
    try {
        const response = await fetchJsonp(url, { jsonpCallback: 'cb' })
        return await response.json()
    } catch (err) {
        console.error(err.message)
    }
}

