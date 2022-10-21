# -*- coding: UTF-8 -*-
import base64
import os
import shutil
import time

from facer.download_watchface.watchface_utils.wf_utils import download_handler, unzip_file, base64_to_string, \
    write_content_to_file, read_file


def download_and_unzip_face(watchface_list, watchface_home_dir_path):
    # 获取文件夹下已有的表盘名
    watchface_names = get_dir_watchfaces(watchface_home_dir_path)
    print('--->' + str(watchface_names))

    f = open(watchface_list, mode="r")

    for line in f:
        url = ""
        # 获取每一行的 base64
        url = (url + line).replace('\n', '')
        # 每一次下载都睡眠1秒钟
        time.sleep(1)
        download_watchface_by_url(url)




def download_watchface_by_url(url):
    """
    提供给api用来解析表盘文件
    :param url:
    :return:
    """
    watchface_home_dir_path = '/Users/knight/Desktop/magicfacer/表盘/watchfaces'
    # 获取文件夹下已有的表盘名
    watchface_names = get_dir_watchfaces(watchface_home_dir_path)

    # 0、检查该表盘文件存不存在，如果存在则跳过不再下载
    flag = check_watchface_exist(url, watchface_names)

    # 1、下载表盘
    watchface_file_path, zip_file_path, watchface_name = download_watchface(url, watchface_home_dir_path)

    # 2、解压表盘
    unzip_watchface(zip_file_path, watchface_file_path)

    # 3、将表盘文件里面的watchfacer.json加密文件转成标准的json文件
    print("--------将表盘文件里面的watchfacer.json加密文件转成标准的json文件--------")
    base64_to_strfile(watchface_file_path + '/watchface.json', watchface_file_path + '/watchface_new.json', )

    # 4、将表盘文件里的base64图片转成png图片
    prase_watchface_images(watchface_file_path)


def check_watchface_exist(url, watchface_names):
    """
    检查该url对应的表盘是不是已下载
    :param url:
    :param watchface_names:
    :return:
    """
    file_prefix = url.split('_')[0]
    watchface_name = url.replace(file_prefix + '_', '').replace('.face', '').replace('\n', '')
    if watchface_name in watchface_names:
        print(str(watchface_name) + ':已经存在，无需再下载')
        return True
    print(str(watchface_name) + ':即将开始下载~~~')
    return False


def get_dir_watchfaces(watchface_home_dir_path):
    """
    获取表盘文件夹下所有的表盘名
    :param watchface_home_dir_path:
    :return:
    """
    datanames = os.listdir(watchface_home_dir_path)
    list = []
    for i in datanames:
        list.append(i)
    return list


def prase_watchface_images(watchface_file_path):
    """
    将每个表盘文件夹下的加密images转为正常可读的images
    :param watchface_file_path:
    :return:
    """
    watchface_file_path = watchface_file_path + '/images/'
    # 读取文件夹内的每个文件
    datanames = os.listdir(watchface_file_path)
    img_list = []
    for i in datanames:
        img_list.append(i)
    print(img_list)

    for img_name in img_list:
        if 'DS_Store' in img_name or '.png' in img_name:
            continue
        # 读取图片的base64转成image
        src_img_file_path = watchface_file_path + img_name
        dst_img_file_path = watchface_file_path + img_name + '.png'
        # empty_img_file_path = watchface_file_path + '/empty/' + img_name
        print(dst_img_file_path)
        # 读取文本内容
        base64_content = read_file(src_img_file_path)
        # if len(base64_content) == 0:
        #     movefile(src_img_file_path, empty_img_file_path)
        # base64转图片
        base64_to_image(base64_content, dst_img_file_path)


def movefile(srcfile, dstpath):
    """
    移动文件到指定文件夹
    :param srcfile:
    :param dstpath:
    :return:
    """
    print(srcfile + '---' + dstpath)
    if not os.path.isfile(srcfile):
        print("%s not exist!" % (srcfile))
    else:
        fpath, fname = os.path.split(srcfile)  # 分离文件名和路径
        if not os.path.exists(dstpath):
            os.makedirs(dstpath)  # 创建路径
        shutil.move(srcfile, dstpath + fname)  # 移动文件
        print("move %s -> %s" % (srcfile, dstpath + fname))


def base64_to_image(content, watchface_img_path):
    """
    base64转图片
    :param content:
    :param img_path:
    :return:
    """
    # 打印图片格式
    img_format = content.split(",")[0].replace('data:image/', '').replace(';base64', '')
    print(img_format)
    # base64 转图片
    imgdata = decode_base64(content)
    # 写图片文件
    with open(watchface_img_path, mode="wb") as ff:
        ff.write(imgdata)
        ff.close()


def download_watchface(url, watchface_home_dir_path):
    """
    根据url下载表盘
    :param url:
    :return:
    """
    print('===1、下载文件===')
    # 1、下载文件
    file_prefix = url.split('_')[0]
    watchface_name = url.replace(file_prefix + '_', '').replace('.face', '').replace('\n', '')
    watchface_file_path = watchface_home_dir_path + '/' + watchface_name
    zip_file_path = watchface_file_path + '.zip'
    print(url + ' --> ' + zip_file_path)
    download_handler(url, zip_file_path)
    return watchface_file_path, zip_file_path, watchface_name


def unzip_watchface(zip_src, dst_dir):
    """
    解压表盘文件
    :param dir_path:
    :param file_name:
    :param file_path:
    :return:
    """
    # 2、解压文件
    print('===2、解压文件===')
    print('zip_src=' + zip_src + ' --> dst_dir=' + dst_dir + '\n')
    unzip_file(zip_src, dst_dir)


def base64_to_strfile(src_file_path, dst_file_path):
    """
    内容写入文件
    :param file_path: 带文件名和文件后缀的文件全路径
    :param file_name: 文件名
    :param base64str: 内容
    """
    # 读取文本内容
    base64str = read_file(src_file_path)

    # base64转文本(json)
    res = base64_to_string(base64str)
    print(res)
    # 写成json文件
    write_content_to_file(dst_file_path, res)


def decode_base64(data):
    """Decode base64, padding being optional.
    :param data: Base64 data as an ASCII byte string
    :returns: The decoded byte string.
    """
    missing_padding = 4 - len(data) % 4
    if missing_padding:
        data += '=' * missing_padding
    return base64.b64decode(data)


if __name__ == '__main__':
    # # 需要处理的表盘列表
    watchface_list = '/Users/knight/workspace/sourceTree/python/facer/download_watchface/watchface_list.txt'
    watchface_home_dir_path = '/Users/knight/Desktop/magicfacer/表盘/watchfaces'
    # download_and_unzip_face(watchface_list, watchface_home_dir_path)


    # watchface_file_path = '/Users/knight/Desktop/magicfacer/表盘/watchfaces/Grandfather_Clock_Free'
    #
    # # 将表盘文件里面的watchfacer.json加密文件转成标准的json文件
    # src_file_path = watchface_file_path + '/watchface.json'
    # dst_file_path = watchface_file_path + '/watchface_new.json'
    # base64_to_strfile(src_file_path, dst_file_path)
    #
    # # 测试将图片的base64转成图片
    # prase_watchface_images(watchface_file_path)

    download_watchface_by_url('https://d33bq1v1gicys9.cloudfront.net/original/57d8dc9beafd3b82c499708ecbf44fe1_Grandfather_Clock_Free.face');
