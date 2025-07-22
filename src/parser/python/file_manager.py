import json
from typing import List, Dict, Optional
from url_utils import UrlUtils  # Импорт утилиты

class FileManager:
    @staticmethod
    def read_local_file(filepath: str) -> Optional[str]:
        try:
            with open(filepath, 'r', encoding='utf-8') as file:
                return file.read()
        except Exception:
            return None

    @staticmethod
    def save_to_json(data: List[Dict[str, str]], filename: str = "performances.json"):
        try:
            for performance in data:
                url = performance.get('detail_url')
                if url:
                    cleaned = UrlUtils.clean_url(url)
                    performance['detail_url'] = UrlUtils.add_https_suffix(cleaned)

            with open(filename, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception:
            pass

    @staticmethod
    def print_performances(performances: List[Dict[str, str]]):
        detail_url_count = sum(1 for perf in performances if perf.get('detail_url'))

        if detail_url_count > 0:
            print(f"Found {len(performances)} performances, {detail_url_count} with detail URLs")
        else:
            print(f"Found {len(performances)} performances, no detail URLs found")
