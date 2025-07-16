import sys
import re
from afisha_parser import AfishaParser


def validate_url(url):
    """Проверяет корректность URL"""
    if not url:
        return False

    # Проверяем, что URL начинается правильно и не содержит лишних частей
    url_pattern = r'^https?://[^\s/$.?#].[^\s]*$'
    return re.match(url_pattern, url) is not None


def main():
    parser = AfishaParser()

    if len(sys.argv) > 1:
        source = sys.argv[1].strip()

        # Проверяем, что URL корректный
        if source.startswith("http://") or source.startswith("https://"):
            if not validate_url(source):
                print(f"Error: Invalid URL format: {source}")
                sys.exit(1)

        print(f"Processing: {source}")
    else:
        source = "https://www.afisha.ru/w/creations/performance/2487/f9f12827-da00-4200-80aa-b755ed5e3e51/"
        print(f"Using default URL: {source}")

    try:
        if source.startswith("http://") or source.startswith("https://"):
            performances = parser.parse_performances_from_url(source)
        else:
            performances = parser.parse_performances_from_file(source)

        parser.save_to_json(performances)

        if performances:
            print(f"Successfully parsed {len(performances)} performances")
            parser.print_performances(performances)
        else:
            print("No performances found")

    except Exception as e:
        print(f"Error during parsing: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()