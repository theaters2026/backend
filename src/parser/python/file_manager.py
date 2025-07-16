
import json
import os
from typing import List, Dict, Optional


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
        """Сохраняет данные в JSON файл, добавляя /https к detail_url если нужно"""
        try:
            # Проверяем и добавляем /https к detail_url перед сохранением
            for performance in data:
                if performance.get('detail_url'):
                    performance['detail_url'] = FileManager._add_https_suffix(performance['detail_url'])

            with open(filename, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception:
            pass

    @staticmethod
    def _add_https_suffix(url: str) -> str:
        """Добавляет /https в конец URL если его там нет"""
        if not url:
            return url

        # Убираем trailing slash если есть
        url = url.rstrip('/')

        # Проверяем, не заканчивается ли уже на /https
        if not url.endswith('/https'):
            # Добавляем /https
            return f"{url}/https"

        return url

    @staticmethod
    def print_performances(performances: List[Dict[str, str]]):
        detail_url_count = sum(1 for perf in performances if perf.get('detail_url'))
        print(f"\n=== Статистика ===")
        print(f"Всего событий: {len(performances)}")
        print(f"С detail_url: {detail_url_count}")
        print(f"Без detail_url: {len(performances) - detail_url_count}")
        print("=" * 50)

        for i, perf in enumerate(performances, 1):
            print(f"\n{i}. {perf['title']}")
            print(f"   Категория: {perf['category']}")
            print(f"   Возрастной рейтинг: {perf['age_rating']}")
            print(f"   Дата и время: {perf['datetime']}")
            print(f"   Место: {perf['venue']}")
            print(f"   Цена: {perf['price']}")
            print(f"   Изображение: {perf['image_filename']}")
            if perf.get('detail_url'):
                print(f"   ✓ Детальная ссылка: {perf['detail_url']}")
            else:
                print(f"   ✗ Детальная ссылка: отсутствует")
