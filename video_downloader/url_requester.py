"""
requester used to request video source from url and download it.
"""

import zlib
from urllib.request import Request, urlopen
from bs4 import BeautifulSoup


SAVE_PATH = '.\\'
REQUEST_TIME_OUT = 60
DEFAULT_HEADER = {
    'method': 'GET',
    'scheme': 'https',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
    'sec-ch-ua': '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36",
    'cookie': '',
}


def make_request(url, request_type='GET', headers=None, cookie=''):
    if headers is None:
        headers = dict(DEFAULT_HEADER)
    headers['cookie'] = cookie
    try:
        request_message = Request(url=url, headers=headers, method=request_type)
        with urlopen(request_message, timeout=REQUEST_TIME_OUT) as response:
            html_response = zlib.decompress(response.read(), 16 + zlib.MAX_WBITS)
            soup = BeautifulSoup(html_response, features="html.parser").prettify()
    except Exception as err:
        raise err
    return soup


if __name__ == '__main__':
    with open('data', 'r') as f:
        cookie = f.read()
    print(make_request('https://mycourses2.mcgill.ca/d2l/lp/navbars/467015/customlinks/external/5010', cookie=cookie))

