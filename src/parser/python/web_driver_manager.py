import time
from typing import Optional, List, Dict
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from urllib.parse import urlparse

from chrome_config import ChromeConfig
from url_utils import UrlUtils
from link_finder import LinkFinder
from event_parser import EventParser
from webdriver_utils import WebDriverUtils


class WebDriverManager:
    """Главный класс для управления WebDriver"""

    def __init__(self):
        self.chrome_options = ChromeConfig.get_chrome_options()
        self.chromedriver_path = ChromeConfig.get_chromedriver_path()
        self.url_utils = UrlUtils()
        self.link_finder = LinkFinder()
        self.event_parser = EventParser()
        self.webdriver_utils = WebDriverUtils()

    def get_page_content(self, url: str) -> Optional[str]:
        """Получает HTML содержимое страницы"""
        driver = None
        try:
            driver = self._create_driver()
            driver.get(url)
            time.sleep(5)

            self.webdriver_utils.wait_for_content(driver)
            time.sleep(8)
            self.webdriver_utils.scroll_page(driver)

            html_content = driver.page_source
            return html_content

        except Exception:
            return None
        finally:
            if driver:
                try:
                    driver.quit()
                except:
                    pass

    def get_events_with_details(self, url: str) -> List[Dict[str, str]]:
        """Получает события с детальными ссылками"""
        driver = None
        try:
            driver = self._create_driver()
            driver.get(url)
            time.sleep(5)

            self.webdriver_utils.wait_for_content(driver)
            time.sleep(8)
            self.webdriver_utils.scroll_page(driver)

            # Получаем базовый URL для построения полных ссылок
            base_url = f"{urlparse(url).scheme}://{urlparse(url).netloc}"

            # Комбинированный подход: сначала извлекаем данные, затем ищем ссылки
            events_data = self._extract_events_comprehensive(driver, base_url)
            print(f"Found {len(events_data)} events with comprehensive search")

            # Дополнительно пытаемся найти ссылки через клики
            self._enhance_with_click_urls(driver, events_data, url)

            return events_data

        except Exception as e:
            print(f"Error in get_events_with_details: {e}")
            return []
        finally:
            if driver:
                try:
                    driver.quit()
                except:
                    pass

    def _create_driver(self):
        """Создает экземпляр WebDriver"""
        if self.chromedriver_path:
            service = Service(self.chromedriver_path)
            return webdriver.Chrome(service=service, options=self.chrome_options)
        else:
            return webdriver.Chrome(options=self.chrome_options)

    def _extract_events_comprehensive(self, driver, base_url: str) -> List[Dict[str, str]]:
        """Комплексное извлечение событий с поиском ссылок"""
        events_data = []

        try:
            # Находим все блоки событий
            event_blocks = driver.find_elements(By.CSS_SELECTOR, "div._3XrzE._5fgzK")
            print(f"Found {len(event_blocks)} event blocks")

            for i, block in enumerate(event_blocks):
                print(f"Processing block {i + 1}")

                # Извлекаем базовые данные
                event_data = self.event_parser.extract_event_data_from_block(block)

                # Ищем detail_url различными способами
                detail_url = self.link_finder.find_detail_url_comprehensive(driver, block, base_url)

                if detail_url:
                    # Добавляем /https в конец URL
                    detail_url = self.url_utils.add_https_suffix(detail_url)
                    event_data['detail_url'] = detail_url
                    print(f"  ✓ Found detail_url: {detail_url}")
                else:
                    print(f"  ✗ No detail_url found")

                events_data.append(event_data)

        except Exception as e:
            print(f"Error in _extract_events_comprehensive: {e}")

        return events_data

    def _enhance_with_click_urls(self, driver, events_data: List[Dict[str, str]], original_url: str):
        """Дополнительно пытается найти ссылки через клики"""
        print("Enhancing with click URLs...")

        for i, event_data in enumerate(events_data):
            if event_data.get('detail_url'):
                continue  # Уже есть URL

            try:
                # Попытка получить URL через клик
                detail_url = self._try_click_for_url(driver, i, original_url)
                if detail_url:
                    # Добавляем /https в конец URL
                    detail_url = self.url_utils.add_https_suffix(detail_url)
                    event_data['detail_url'] = detail_url
                    print(f"  ✓ Got URL via click for event {i}: {detail_url}")
            except Exception as e:
                print(f"  ✗ Click failed for event {i}: {e}")

    def _try_click_for_url(self, driver, block_index: int, original_url: str) -> Optional[str]:
        """Пытается получить URL через клик"""
        try:
            # Открываем новую вкладку
            driver.execute_script("window.open('');")
            new_tab = driver.window_handles[-1]
            driver.switch_to.window(new_tab)

            # Переходим на исходную страницу
            driver.get(original_url)
            time.sleep(3)

            # Находим блоки
            blocks = driver.find_elements(By.CSS_SELECTOR, "div._3XrzE._5fgzK")

            if block_index < len(blocks):
                block = blocks[block_index]
                current_url = driver.current_url

                # Пытаемся кликнуть
                try:
                    driver.execute_script("arguments[0].scrollIntoView(true);", block)
                    time.sleep(1)
                    ActionChains(driver).move_to_element(block).click().perform()
                    time.sleep(5)

                    new_url = driver.current_url
                    if new_url != current_url:
                        return self.url_utils.clean_url(new_url)

                except Exception as click_error:
                    print(f"Click error: {click_error}")

            return None

        except Exception as e:
            print(f"Error in _try_click_for_url: {e}")
            return None
        finally:
            # Закрываем вкладку и возвращаемся
            try:
                driver.close()
                driver.switch_to.window(driver.window_handles[0])
            except:
                pass
