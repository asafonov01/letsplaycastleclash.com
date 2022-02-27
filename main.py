import aiohttp_jinja2
import jinja2
from aiohttp import web
from aiohttp.web_request import BaseRequest

routes = web.RouteTableDef()


@routes.get('/')
@routes.get('/index')
async def index(_: BaseRequest):
    return web.FileResponse("letsplaycastleclash.com/static/index.html")


@routes.get('/faq')
async def faq(_: BaseRequest):
    return web.FileResponse("letsplaycastleclash.com/static/faq.html")


@routes.get('/payment')
@aiohttp_jinja2.template('payment.jinja2')
async def payment(request: BaseRequest):
    return {
        'tg_id': request.rel_url.query.get('tg_id') or '',
        'count': request.rel_url.query.get('count') or 100
    }


@routes.get('/policy')
async def policy(_: BaseRequest):
    return web.FileResponse("letsplaycastleclash.com/static/policy.html")


@routes.get('/privacy')
async def privacy(_: BaseRequest):
    return web.FileResponse("letsplaycastleclash.com/static/privacy.html")


routes.static('/', 'letsplaycastleclash.com/static')

if __name__ == '__main__':
    app = web.Application()
    # logging.basicConfig(level=logging.DEBUG)

    aiohttp_jinja2.setup(app, loader=jinja2.FileSystemLoader('./letsplaycastleclash.com/templates'), enable_async=True)

    app.add_routes(routes)

    web.run_app(app, port=8055)
