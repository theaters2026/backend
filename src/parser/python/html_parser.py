
from bs4 import BeautifulSoup
from typing import List, Dict, Optional
from image_downloader import ImageDownloader


class HtmlParser:
    def __init__(self, image_downloader: ImageDownloader):
        self.image_downloader = image_downloader

    def parse_performances(self, content: str, base_url: str = None) -> List[Dict[str, str]]:
        if not content:
            return []

        soup = BeautifulSoup(content, "html.parser")
        performances = []

        performance_blocks = self._find_performance_blocks(soup)

        for block in performance_blocks:
            performance_data = self._parse_performance_info(block, base_url)
            if performance_data and (performance_data.get("title") or performance_data.get("name")):
                performances.append(performance_data)

        return performances

    def _find_performance_blocks(self, soup: BeautifulSoup) -> List:
        selectors_to_try = [
            "div._3XrzE._5fgzK",
            "div[class*='_3XrzE']",
            "div[class*='event']",
            "div[class*='performance']",
            "div[class*='card']",
            "article",
            ".event-item",
            "[data-testid*='event']",
            "[data-testid*='performance']"
        ]

        performance_blocks = []

        for selector in selectors_to_try:
            try:
                blocks = soup.select(selector)
                if blocks:
                    performance_blocks = blocks
                    break
            except Exception:
                continue

        return performance_blocks

    def _parse_performance_info(self, performance_div, base_url: str = None) -> Dict[str, str]:
        performance_data = {
            "title": "",
            "category": "",
            "age_rating": "",
            "datetime": "",
            "venue": "",
            "price": "",
            "image_url": "",
            "image_filename": "",
            "detail_url": "",
        }

        try:
            block_text = performance_div.get_text(strip=True)

            self._process_image_info(performance_div, performance_data, base_url)
            self._extract_title(performance_div, performance_data, block_text)
            self._extract_category_and_age(performance_div, performance_data)
            self._extract_datetime_and_venue(performance_div, performance_data)
            self._extract_price(performance_div, performance_data)
            self._extract_detail_url(performance_div, performance_data)

        except Exception:
            pass

        return performance_data

    def _process_image_info(self, performance_div, performance_data: Dict, base_url: str):
        image_elem = performance_div.find("img")
        if image_elem:
            image_url = image_elem.get('src') or image_elem.get('data-src')
            if image_url:
                performance_data["image_url"] = image_url
                filename = self.image_downloader.download_image(image_url, base_url)
                if filename:
                    performance_data["image_filename"] = filename

    def _extract_title(self, performance_div, performance_data: Dict, block_text: str):
        title_selectors = [
            "div.IlTNG",
            "h1", "h2", "h3", "h4",
            "[class*='title']",
            "[class*='name']",
            "[class*='heading']"
        ]

        for selector in title_selectors:
            title_elem = performance_div.select_one(selector)
            if title_elem:
                performance_data["title"] = title_elem.get_text(strip=True)
                return

        if not performance_data["title"] and block_text:
            lines = block_text.split('\n')
            if lines:
                performance_data["title"] = lines[0].strip()

    def _extract_category_and_age(self, performance_div, performance_data: Dict):
        category_selectors = [
            "div._2nsaF",
            "[class*='category']",
            "[class*='genre']",
            "[class*='type']"
        ]

        for selector in category_selectors:
            category_elem = performance_div.select_one(selector)
            if category_elem:
                category_text = category_elem.get_text(strip=True)
                parts = category_text.split(" · ")
                if len(parts) >= 1:
                    performance_data["category"] = parts[0]
                if len(parts) >= 2:
                    performance_data["age_rating"] = parts[1]
                return

    def _extract_datetime_and_venue(self, performance_div, performance_data: Dict):
        datetime_selectors = [
            "div._1E60K",
            "[class*='date']",
            "[class*='time']",
            "[class*='when']"
        ]

        for selector in datetime_selectors:
            datetime_elem = performance_div.select_one(selector)
            if datetime_elem:
                datetime_text = datetime_elem.get_text(strip=True)
                parts = datetime_text.split(" · ")
                if len(parts) >= 1:
                    performance_data["datetime"] = parts[0].strip()
                if len(parts) >= 2:
                    performance_data["venue"] = parts[1].strip()
                return

        if not performance_data["datetime"]:
            all_text = performance_div.get_text(strip=True)
            import re
            date_pattern = r'(\d{1,2}\s+(?:января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря),?\s*\d{1,2}:\d{2})'
            date_match = re.search(date_pattern, all_text)
            if date_match:
                performance_data["datetime"] = date_match.group(1)

    def _extract_price(self, performance_div, performance_data: Dict):
        price_selectors = [
            "span._1QJzJ",
            "[class*='price']",
            "[class*='cost']"
        ]

        for selector in price_selectors:
            price_elem = performance_div.select_one(selector)
            if price_elem:
                performance_data["price"] = price_elem.get_text(strip=True)
                return

    def _extract_detail_url(self, performance_div, performance_data: Dict):
        """Извлекает detail_url из статического HTML"""
        # Ищем ссылки внутри блока
        links = performance_div.find_all("a")
        for link in links:
            href = link.get('href')
            if href and ('performance' in href or 'event' in href):
                # Добавляем /https в конец URL
                performance_data['detail_url'] = self._add_https_suffix(href)
                return

        # Ищем data-атрибуты
        for attr in ['data-href', 'data-url', 'data-link', 'data-event-url']:
            attr_value = performance_div.get(attr)
            if attr_value:
                # Добавляем /https в конец URL
                performance_data['detail_url'] = self._add_https_suffix(attr_value)
                return

    def _add_https_suffix(self, url: str) -> str:
        """Добавляет /https в конец URL"""
        if not url:
            return url

        # Убираем trailing slash если есть
        url = url.rstrip('/')

        # Добавляем /https
        return f"{url}/https"