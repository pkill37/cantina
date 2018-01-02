import fetchJsonp from 'fetch-jsonp'
import Option from './Option'
import Food from './Food'

export const API_URL = 'http://services.web.ua.pt/sas/ementas?date=day&format=jsonp'

export function parseApiResponse(response, dinner = 'dinner') {
    const open = response.menus.menu.filter(m => m.items.item !== {} && !m['@attributes'].disabled.startsWith('Encerrado'))
    const menus = open.filter(m => m['@attributes']['meal'] === dinner ? 'Jantar' : 'Almoço')
    const options = []

    for (const menu of menus) {
        const items = menu.items.item
        const foods = {
            'Sopa': typeof items[0] === 'string' ? new Food(items[0]) : null,
            'Prato Carne': typeof items[1] === 'string' ? new Food(items[1]) : null,
            'Prato Peixe': typeof items[2] === 'string' ? new Food(items[2]) : null,
            'Prato Dieta': typeof items[3] === 'string' ? new Food(items[3]) : null,
            'Prato Vegetariano': typeof items[4] === 'string' ? new Food(items[4]) : null,
            'Prato Opção': typeof items[5] === 'string' ? new Food(items[5]) : null,
            'Salada': typeof items[6] === 'string' ? new Food(items[6]) : null,
            'Diversos': typeof items[7] === 'string' ? new Food(items[7]) : null,
            'Sobremesa': typeof items[8] === 'string' ? new Food(items[8]) : null,
            'Bebida': typeof items[9] === 'string' ? new Food(items[9]) : null,
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

