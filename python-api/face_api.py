# -*- coding: utf8 -*-
import json
import logging

import bottle
from bottle import request
from bottle import run, hook, route, static_file

from facer.download_watchface.download_watchface import download_watchface_by_url

app = bottle.default_app()

logging.getLogger().setLevel(logging.DEBUG)


# url路径，在本机运行后   浏览器可以通过 http://127.0.0.1:8080/html/<path> 访问该html页面，<path>表示你具体要访问的文件的名字，例如index.html
# 定义一个函数，path作为参数传给给函数
# 返回你要访问的静态文件，里面两个参数，一个是path，一个是你文件所在的具体位置,例如该root表示你要访问的文件在该目录的上级目录下的html文件夹内的名为path的文件


# # 计算器页面访问地址 http://127.0.0.1:8080/calculator/index.html
# @route('/calculator/<path>')
# def html(path):
#     return static_file(path, root='../calculator/')


# 接收接口传过来的值进行计算（form-data传值url=xxx）
@route("/data_json", method='post')
def calculatorData():
    # content = str(request.body.readlines()[0])

    # content = str(request.body.readlines())

    body_params = json.loads(bottle.request.body.readlines()[0])
    watchface_url = body_params.get('url')
    print("result =" + watchface_url)
    download_watchface_by_url(watchface_url)
    return watchface_url

    # watchface_url = postValue.get('url')
    # logging.info(watchface_url)
    # print("result =" + watchface_url)
    # download_watchface_by_url(watchface_url)
    # return str(watchface_url)


# 解决跨域问题
@hook('before_request')
def before_request():
    request_method = request.environ.get('REQUEST_METHOD')
    http_access_control_request_method = request.environ.get('HTTP_ACCESS_CONTROL_REQUEST_METHOD')
    if request_method == 'OPTIONS' and http_access_control_request_method:
        request.environ['REQUEST_METHOD'] = http_access_control_request_method


@hook('after_request')
def after_request():
    bottle.response.headers['Access-Control-Allow-Origin'] = '*'
    # bottle.response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    bottle.response.headers['Access-Control-Allow-Headers'] = '*'


run(host="0.0.0.0", port=8080)
