import logging

import aiohttp_jinja2
import jinja2
from aiohttp import web
from aiohttp.web_request import BaseRequest
from babel.core import Locale, UnknownLocaleError
from babel.support import Translations
from aiohttp.web import middleware

routes = web.RouteTableDef()


@middleware
async def locale_middleware(request, handler):
    _code = request.cookies.get('locale', False)
    if not _code:
        locale_code = request.headers.get('ACCEPT-LANGUAGE', 'en')[:2]
        try:
            _code = str(Locale.parse(locale_code, sep='-'))
        except (ValueError, UnknownLocaleError):
            logging.debug(f'Invalid locale: {_code}')
            pass

    translations = Translations.load('locales', _code or 'en')
    request['lang'] = _code


    jinja_environment = aiohttp_jinja2.setup(app, loader=jinja2.FileSystemLoader('./letsplaycastleclash.com/templates'), enable_async=True, extensions=['jinja2.ext.i18n'])
    jinja_environment.install_gettext_translations(translations)

    resp = await handler(request)
    return resp


@routes.get('/')
@routes.get('/index')
@aiohttp_jinja2.template('index.jinja2')
async def index(request: BaseRequest):
    return {'lang': request['lang']}


@routes.get('/faq')
@aiohttp_jinja2.template('faq.jinja2')
async def faq(_: BaseRequest):
    return {}


@routes.get('/payment')
@aiohttp_jinja2.template('payment.jinja2')
async def payment(request: BaseRequest):
    return {
        'tg_id': request.rel_url.query.get('tg_id') or '',
        'count': request.rel_url.query.get('count') or 100
    }


@routes.get('/policy')
@aiohttp_jinja2.template('policy.jinja2')
async def policy(_: BaseRequest):
    return {}


@routes.get('/privacy')
@aiohttp_jinja2.template('privacy.jinja2')
async def privacy(_: BaseRequest):
    return {}


routes.static('/static', 'letsplaycastleclash.com/static')

if __name__ == '__main__':
    app = web.Application(middlewares=[locale_middleware])
    logging.basicConfig(level=logging.DEBUG)

    app.add_routes(routes)

    web.run_app(app, port=8055)
