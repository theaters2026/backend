import sys
import re
from afisha_parser import AfishaParser


def validate_url(url):
    if not url:
        return False

    url_pattern = r'^https?://[^\s/$.?#].[^\s]*$'
    return re.match(url_pattern, url) is not None


def main():
    parser = AfishaParser()

    if len(sys.argv) > 1:
        source = sys.argv[1].strip()

        if source.startswith("http://") or source.startswith("https://"):
            if not validate_url(source):
                print(f"Error: Invalid URL format: {source}")
                sys.exit(1)
    else:
        source = "https://www.afisha.ru/w/creations/performance/2487/f9f12827-da00-4200-80aa-b755ed5e3e51/"

    try:
        if source.startswith("http://") or source.startswith("https://"):
            performances = parser.parse_performances_from_url(source)
        else:
            performances = parser.parse_performances_from_file(source)

        if performances:
            parser.save_to_json(performances)
            parser.print_performances(performances)
        else:
            print("No performances with detail URLs found")

    except Exception as e:
        print(f"Error during parsing: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
