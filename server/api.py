from sanic import Sanic
from sanic.response import json
from sanic.log import log
from sanic_cors import CORS

import aiohttp
import os
from pprint import pprint

app = Sanic()
app.static('/', '../client/index.html')
app.static('/scripts/main.js', '../client/scripts/main.js')
app.static('/styles/main.css', '../client/styles/main.css')
CORS(app)

async def fetch(session, url):
    async with session.get(url) as response:
        return await response.json()

@app.route("/api")
async def api(request):
    url = 'http://services.web.ua.pt/sas/ementas?format=json'

    async with aiohttp.ClientSession() as session:
        response = await fetch(session, url)

    menu = response['menus']['menu']

    res = menu

    return json(res)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=1337, debug=True)
