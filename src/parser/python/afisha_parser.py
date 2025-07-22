from typing import List, Dict, Optional
from web_driver_manager import WebDriverManager
from html_parser import HtmlParser
from file_manager import FileManager


class AfishaParser:
    def __init__(self):
        self.web_driver = WebDriverManager()
        self.html_parser = HtmlParser()
        self.file_manager = FileManager()

    def parse_performances_from_url(self, url: str) -> List[Dict[str, str]]:
        try:
            events_with_details = self.web_driver.get_events_with_details(url)

            if events_with_details:
                events_with_urls = [event for event in events_with_details if event.get('detail_url')]
                if events_with_urls:
                    return events_with_urls

            html_content = self.web_driver.get_page_content(url)
            if html_content:
                return self.html_parser.parse_performances(html_content, url)
            else:
                return []

        except Exception as e:
            print(f"Error parsing URL {url}: {e}")
            return []

    def parse_performances_from_file(self, filepath: str) -> List[Dict[str, str]]:
        try:
            html_content = self.file_manager.read_local_file(filepath)
            if html_content:
                return self.html_parser.parse_performances(html_content)
            else:
                return []
        except Exception as e:
            print(f"Error parsing file {filepath}: {e}")
            return []

    def save_to_json(self, performances: List[Dict[str, str]], filename: str = "performances.json"):
        try:
            self.file_manager.save_to_json(performances, filename)
        except Exception as e:
            print(f"Error saving to JSON: {e}")

    def print_performances(self, performances: List[Dict[str, str]]):
        try:
            self.file_manager.print_performances(performances)
        except Exception as e:
            print(f"Error printing performances: {e}")
