from typing import List, Dict

from bs4 import BeautifulSoup


class HtmlParser:
    def __init__(self):
        pass

    def parse_performances(self, content: str, base_url: str = None) -> List[Dict[str, str]]:
        if not content:
            return []

        soup = BeautifulSoup(content, "html.parser")
        performances = []

        performance_blocks = self._find_performance_blocks(soup)

        for block in performance_blocks:
            performance_data = self._parse_performance_info(block, base_url)
            if performance_data and performance_data.get("title"):
                performances.append(performance_data)

        return performances

    def _find_performance_blocks(self, soup: BeautifulSoup) -> List:
        selectors_to_try = [
            "div._3XrzE._5fgzK",
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
            "detail_url": "",
        }

        try:
            block_text = performance_div.get_text(strip=True)

            self._extract_title(performance_div, performance_data, block_text)
            self._extract_detail_url(performance_div, performance_data)

        except Exception:
            pass

        return performance_data

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

    def _extract_detail_url(self, performance_div, performance_data: Dict):
        links = performance_div.find_all("a")
        for link in links:
            href = link.get('href')
            if href and ('performance' in href or 'event' in href):
                performance_data['detail_url'] = href
                return

        for attr in ['data-href', 'data-url', 'data-link', 'data-event-url']:
            attr_value = performance_div.get(attr)
            if attr_value:
                performance_data['detail_url'] = attr_value
                return
