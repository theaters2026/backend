from typing import List, Dict, Optional
from web_driver_manager import WebDriverManager
from image_downloader import ImageDownloader
from html_parser import HtmlParser
from file_manager import FileManager


class AfishaParser:
    def __init__(self):
        self.web_driver = WebDriverManager()
        self.image_downloader = ImageDownloader()
        self.html_parser = HtmlParser(self.image_downloader)
        self.file_manager = FileManager()

    def parse_performances_from_url(self, url: str) -> List[Dict[str, str]]:
        try:
            print(f"Attempting to parse URL: {url}")

            # Сначала пытаемся получить события с detail_url через клики
            events_with_details = self.web_driver.get_events_with_details(url)

            if events_with_details:
                print(f"Found {len(events_with_details)} events with details via clicks")
                # Обрабатываем изображения для событий с detail_url
                for event in events_with_details:
                    if event.get('image_url'):
                        filename = self.image_downloader.download_image(event['image_url'], url)
                        event['image_filename'] = filename or ""
                    else:
                        event['image_filename'] = ""
                return events_with_details

            print("No events found via clicks, trying HTML parsing")
            # Если не получилось через клики, используем обычный парсинг HTML
            html_content = self.web_driver.get_page_content(url)
            if html_content:
                return self.html_parser.parse_performances(html_content, url)
            else:
                print("Failed to get HTML content")
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
                print(f"Failed to read file: {filepath}")
                return []
        except Exception as e:
            print(f"Error parsing file {filepath}: {e}")
            return []

    def save_to_json(self, performances: List[Dict[str, str]], filename: str = "performances.json"):
        try:
            self.file_manager.save_to_json(performances, filename)
            print(f"Successfully saved {len(performances)} performances to {filename}")
        except Exception as e:
            print(f"Error saving to JSON: {e}")

    def print_performances(self, performances: List[Dict[str, str]]):
        try:
            self.file_manager.print_performances(performances)
        except Exception as e:
            print(f"Error printing performances: {e}")
