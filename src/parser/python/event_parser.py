from typing import Dict

from selenium.webdriver.common.by import By


class EventParser:

    def extract_event_data_from_block(self, block) -> Dict[str, str]:
        event_data = {
            "title": "",
            "detail_url": ""
        }

        try:
            title_elem = block.find_element(By.CSS_SELECTOR, "div.IlTNG")
            event_data["title"] = title_elem.text.strip()
        except:
            pass

        return event_data
