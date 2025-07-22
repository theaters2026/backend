import re
from typing import Optional

from selenium.webdriver.common.by import By

from url_utils import UrlUtils


class LinkFinder:

    def __init__(self):
        self.url_utils = UrlUtils()

    def find_detail_url_comprehensive(self, driver, block, base_url: str) -> Optional[str]:

        url = self._find_direct_links(block, base_url)
        if url:
            return url

        url = self._find_js_links(driver, block, base_url)
        if url:
            return url

        url = self._find_data_attributes(block, base_url)
        if url:
            return url

        url = self._find_in_html_source(driver, block, base_url)
        if url:
            return url

        url = self._find_in_parent_elements(block, base_url)
        if url:
            return url

        return None

    def _find_direct_links(self, block, base_url: str) -> Optional[str]:
        try:
            links = block.find_elements(By.CSS_SELECTOR, "a")
            for link in links:
                href = link.get_attribute('href')
                if href:
                    clean_href = self.url_utils.clean_url(href)
                    if self.url_utils.is_valid_performance_url(clean_href):
                        return self.url_utils.normalize_url(clean_href, base_url)
        except Exception as e:
            print(f"Error in _find_direct_links: {e}")
        return None

    def _find_js_links(self, driver, block, base_url: str) -> Optional[str]:
        try:
            links = driver.execute_script("""
                var element = arguments[0];
                var links = [];
                var allLinks = element.querySelectorAll('a');
                for (var i = 0; i < allLinks.length; i++) {
                    if (allLinks[i].href) {
                        links.push(allLinks[i].href);
                    }
                }
                return links;
            """, block)

            for href in links:
                if href:
                    clean_href = self.url_utils.clean_url(href)
                    if self.url_utils.is_valid_performance_url(clean_href):
                        return self.url_utils.normalize_url(clean_href, base_url)

        except Exception as e:
            print(f"Error in _find_js_links: {e}")
        return None

    def _find_data_attributes(self, block, base_url: str) -> Optional[str]:
        try:
            data_attrs = [
                'data-href', 'data-url', 'data-link', 'data-event-url',
                'data-performance-url', 'data-target', 'data-to'
            ]

            for attr in data_attrs:
                attr_value = block.get_attribute(attr)
                if attr_value:
                    clean_value = self.url_utils.clean_url(attr_value)
                    if self.url_utils.is_valid_performance_url(clean_value):
                        return self.url_utils.normalize_url(clean_value, base_url)
        except Exception as e:
            print(f"Error in _find_data_attributes: {e}")
        return None

    def _find_in_html_source(self, driver, block, base_url: str) -> Optional[str]:
        try:
            html_content = block.get_attribute('innerHTML')
            if html_content:
                url_patterns = [
                    r'href=["\']([^"\']*performance[^"\']*)["\']',
                    r'href=["\']([^"\']*event[^"\']*)["\']',
                    r'href=["\']([^"\']*creations[^"\']*)["\']',
                    r'data-href=["\']([^"\']*performance[^"\']*)["\']',
                    r'data-url=["\']([^"\']*performance[^"\']*)["\']'
                ]

                for pattern in url_patterns:
                    matches = re.findall(pattern, html_content, re.IGNORECASE)
                    for match in matches:
                        clean_match = self.url_utils.clean_url(match)
                        if self.url_utils.is_valid_performance_url(clean_match):
                            return self.url_utils.normalize_url(clean_match, base_url)
        except Exception as e:
            print(f"Error in _find_in_html_source: {e}")
        return None

    def _find_in_parent_elements(self, block, base_url: str) -> Optional[str]:
        try:
            current_element = block
            for level in range(3):
                try:
                    parent = current_element.find_element(By.XPATH, "..")
                    links = parent.find_elements(By.CSS_SELECTOR, "a")
                    for link in links:
                        href = link.get_attribute('href')
                        if href:
                            clean_href = self.url_utils.clean_url(href)
                            if self.url_utils.is_valid_performance_url(clean_href):
                                return self.url_utils.normalize_url(clean_href, base_url)
                    current_element = parent
                except:
                    break
        except Exception as e:
            print(f"Error in _find_in_parent_elements: {e}")
        return None
