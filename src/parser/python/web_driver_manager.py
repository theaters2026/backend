import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from typing import Optional, List, Dict

from chrome_config import ChromeConfig
from event_parser import EventParser
from link_finder import LinkFinder
from url_utils import UrlUtils
from webdriver_utils import WebDriverUtils


class WebDriverManager:

    def __init__(self):
        self.chrome_options = ChromeConfig.get_chrome_options()
        self.chromedriver_path = ChromeConfig.get_chromedriver_path()
        self.url_utils = UrlUtils()
        self.link_finder = LinkFinder()
        self.event_parser = EventParser()
        self.webdriver_utils = WebDriverUtils()

    def get_page_content(self, url: str) -> Optional[str]:
        driver = None
        try:
            driver = self._create_driver()
            driver.get(url)

            self._wait_and_scroll(driver)

            return driver.page_source

        except Exception as e:
            print(f"Error in get_page_content: {e}")
            return None
        finally:
            if driver:
                try:
                    driver.quit()
                except:
                    pass

    def get_events_with_details(self, url: str) -> List[Dict[str, str]]:
        driver = None
        try:
            driver = self._create_driver()
            driver.get(url)

            self._wait_and_scroll(driver)

            event_blocks = []
            for attempt in range(3):
                event_blocks = driver.find_elements(By.CSS_SELECTOR, "div._3XrzE._5fgzK")
                if event_blocks:
                    break
                print(f"Attempt {attempt+1}: no event blocks found, waiting and scrolling again...")
                time.sleep(3)
                self.webdriver_utils.scroll_page(driver)

            if not event_blocks:
                print("No event blocks found after retries.")
                return []

            events_data = []
            successful_clicks = 0

            for i, block in enumerate(event_blocks):
                event_data = self.event_parser.extract_event_data_from_block(block)

                detail_url = self._try_click_for_url(driver, i, url)

                if detail_url:
                    detail_url = self.url_utils.add_https_suffix(detail_url)
                    event_data['detail_url'] = detail_url
                    successful_clicks += 1

                events_data.append(event_data)

            if successful_clicks > 0:
                print(f"Successfully found {successful_clicks} detail URLs via clicks")

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
        if self.chromedriver_path:
            service = Service(self.chromedriver_path)
            return webdriver.Chrome(service=service, options=self.chrome_options)
        else:
            return webdriver.Chrome(options=self.chrome_options)

    def _try_click_for_url(self, driver, block_index: int, original_url: str) -> Optional[str]:
        try:
            driver.execute_script("window.open('');")
            new_tab = driver.window_handles[-1]
            driver.switch_to.window(new_tab)

            driver.get(original_url)
            time.sleep(3)

            blocks = driver.find_elements(By.CSS_SELECTOR, "div._3XrzE._5fgzK")

            if block_index < len(blocks):
                block = blocks[block_index]
                current_url = driver.current_url

                try:
                    driver.execute_script("arguments[0].scrollIntoView(true);", block)
                    time.sleep(1)
                    ActionChains(driver).move_to_element(block).click().perform()
                    WebDriverWait(driver, 10).until(EC.url_changes(current_url))
                    time.sleep(2)

                    new_url = driver.current_url
                    if new_url != current_url:
                        return self.url_utils.clean_url(new_url)

                except Exception as click_err:
                    print(f"Click failed on block {block_index}: {click_err}")

            return None

        except Exception as tab_err:
            print(f"Error in _try_click_for_url: {tab_err}")
            return None
        finally:
            try:
                driver.close()
                driver.switch_to.window(driver.window_handles[0])
            except:
                pass

    def _wait_and_scroll(self, driver):
        try:
            self.webdriver_utils.wait_for_content(driver)
            for i in range(3):
                self.webdriver_utils.scroll_page(driver)
                time.sleep(3)
        except Exception as e:
            print(f"Error during wait and scroll: {e}")
