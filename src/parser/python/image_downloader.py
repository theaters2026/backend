import os
import requests
import uuid
from urllib.parse import urljoin, urlparse
from PIL import Image
from io import BytesIO
from typing import Optional


class ImageDownloader:
    def __init__(self, images_dir: str = "static/images"):
        self.images_dir = images_dir
        os.makedirs(self.images_dir, exist_ok=True)

    def download_image(self, image_url: str, base_url: str = None) -> Optional[str]:
        try:
            if base_url and not image_url.startswith('http'):
                image_url = urljoin(base_url, image_url)

            image_id = str(uuid.uuid4())

            headers = {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }

            response = requests.get(image_url, headers=headers, timeout=10)
            response.raise_for_status()

            return self._process_image(response.content, image_id, image_url)

        except Exception:
            return None

    def _process_image(self, image_data: bytes, image_id: str, image_url: str) -> Optional[str]:
        try:
            image = Image.open(BytesIO(image_data))
            format = image.format.lower() if image.format else 'jpeg'

            if image.mode in ('RGBA', 'LA', 'P'):
                image = image.convert('RGB')
                format = 'jpeg'

            filename = f"{image_id}.{format}"
            filepath = os.path.join(self.images_dir, filename)

            image.save(filepath, format=format.upper(), quality=85, optimize=True)

            return filename

        except Exception:
            return self._save_raw_image(image_data, image_id, image_url)

    def _save_raw_image(self, image_data: bytes, image_id: str, image_url: str) -> Optional[str]:
        try:
            extension = self._get_extension_from_url(image_url) or 'jpg'
            filename = f"{image_id}.{extension}"
            filepath = os.path.join(self.images_dir, filename)

            with open(filepath, 'wb') as f:
                f.write(image_data)

            return filename
        except Exception:
            return None

    def _get_extension_from_url(self, url: str) -> str:
        try:
            parsed_url = urlparse(url)
            path = parsed_url.path
            if '.' in path:
                return path.split('.')[-1].lower()
        except:
            pass
        return 'jpg'