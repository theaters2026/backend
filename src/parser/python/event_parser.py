from typing import Dict
from selenium.webdriver.common.by import By


class EventParser:
    """Класс для парсинга данных событий"""

    def extract_event_data_from_block(self, block) -> Dict[str, str]:
        """Извлекает данные события из блока"""
        event_data = {
            "title": "",
            "category": "",
            "age_rating": "",
            "datetime": "",
            "venue": "",
            "price": "",
            "image_url": "",
            "detail_url": ""
        }

        try:
            # Заголовок
            title_elem = block.find_element(By.CSS_SELECTOR, "div.IlTNG")
            event_data["title"] = title_elem.text.strip()
        except:
            pass

        try:
            # Категория и возраст
            category_elem = block.find_element(By.CSS_SELECTOR, "div._2nsaF")
            category_text = category_elem.text.strip()
            parts = category_text.split(" · ")
            if len(parts) >= 1:
                event_data["category"] = parts[0]
            if len(parts) >= 2:
                event_data["age_rating"] = parts[1]
        except:
            pass

        try:
            # Дата и место
            datetime_elem = block.find_element(By.CSS_SELECTOR, "div._1E60K")
            datetime_text = datetime_elem.text.strip()
            parts = datetime_text.split(" · ")
            if len(parts) >= 1:
                event_data["datetime"] = parts[0]
            if len(parts) >= 2:
                event_data["venue"] = parts[1]
        except:
            pass

        try:
            # Цена
            price_elem = block.find_element(By.CSS_SELECTOR, "span._1QJzJ")
            event_data["price"] = price_elem.text.strip()
        except:
            pass

        try:
            # Изображение
            img_elem = block.find_element(By.CSS_SELECTOR, "img")
            event_data["image_url"] = img_elem.get_attribute("src")
        except:
            pass

        return event_data
