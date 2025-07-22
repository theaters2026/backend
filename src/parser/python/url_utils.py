import re
from urllib.parse import urljoin


class UrlUtils:
    """Утилиты для работы с URL"""

    @staticmethod
    def clean_url(url: str) -> str:
        if not url:
            return ""

        url = re.sub(r'https?://.*?(https?://)', r'\1', url)

        url = re.sub(r'(https?://[^/]+).*?\1', r'\1', url)

        url = re.sub(r'/?https?/?$', '', url)

        return url.strip()

    @staticmethod
    def is_valid_performance_url(url: str) -> bool:
        if not url:
            return False

        keywords = ['performance', 'event', 'creations']
        if not any(keyword in url.lower() for keyword in keywords):
            return False

        if url.startswith('#') or url.startswith('javascript:'):
            return False

        return True

    @staticmethod
    def normalize_url(url: str, base_url: str) -> str:
        if not url:
            return ""

        if url.startswith('/'):
            return urljoin(base_url, url)
        elif url.startswith('http'):
            return url
        else:
            return urljoin(base_url, url)

    @staticmethod
    def add_https_suffix(url: str) -> str:
        if not url:
            return url

        url = url.rstrip('/')

        return f"{url}/https"

    @staticmethod
    def is_valid_url(url: str) -> bool:
        if not url:
            return False

        url_pattern = r'^https?://[^\s/$.?#].[^\s]*$'
        return re.match(url_pattern, url) is not None
