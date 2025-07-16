import re
from typing import Optional
from urllib.parse import urljoin, urlparse


class UrlUtils:
    """Утилиты для работы с URL"""

    @staticmethod
    def clean_url(url: str) -> str:
        """Очищает URL от артефактов"""
        if not url:
            return ""

        # Удаляем возможные дубликаты протокола
        url = re.sub(r'https?://.*?(https?://)', r'\1', url)

        # Удаляем возможные дубликаты доменов
        url = re.sub(r'(https?://[^/]+).*?\1', r'\1', url)

        # Удаляем trailing "https" или "http"
        url = re.sub(r'/?https?/?$', '', url)

        return url.strip()

    @staticmethod
    def is_valid_performance_url(url: str) -> bool:
        """Проверяет, является ли URL валидной ссылкой на спектакль"""
        if not url:
            return False

        # Проверяем наличие ключевых слов
        keywords = ['performance', 'event', 'creations']
        if not any(keyword in url.lower() for keyword in keywords):
            return False

        # Проверяем, что это не просто фрагмент
        if url.startswith('#') or url.startswith('javascript:'):
            return False

        return True

    @staticmethod
    def normalize_url(url: str, base_url: str) -> str:
        """Нормализует URL"""
        if not url:
            return ""

        # Если URL относительный, делаем его абсолютным
        if url.startswith('/'):
            return urljoin(base_url, url)
        elif url.startswith('http'):
            return url
        else:
            return urljoin(base_url, url)

    @staticmethod
    def add_https_suffix(url: str) -> str:
        """Добавляет /https в конец URL"""
        if not url:
            return url

        # Убираем trailing slash если есть
        url = url.rstrip('/')

        # Добавляем /https
        return f"{url}/https"
