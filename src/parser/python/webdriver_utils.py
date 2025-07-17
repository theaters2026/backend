import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class WebDriverUtils:

    @staticmethod
    def wait_for_content(driver):
        selectors_to_try = [
            "div._3XrzE._5fgzK",
            "._3ErvA",
            "div[class*='_3ErvA']",
            "div[class*='performance']",
            "div[class*='event']",
            ".event-item",
            "div[class*='card']",
            "body"
        ]

        for selector in selectors_to_try:
            try:
                wait = WebDriverWait(driver, 10)
                if selector.startswith(".") or selector.startswith("#"):
                    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
                else:
                    wait.until(EC.presence_of_element_located((By.CLASS_NAME, selector)))
                break
            except:
                continue

    @staticmethod
    def scroll_page(driver):
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)
        driver.execute_script("window.scrollTo(0, 0);")
        time.sleep(2)
