import sys

from afisha_parser import AfishaParser
from url_utils import UrlUtils


def main():
    parser = AfishaParser()

    if len(sys.argv) > 1:
        source = sys.argv[1].strip()

        if UrlUtils.is_valid_url(source):
            performances = parser.parse_performances_from_url(source)
        else:
            performances = parser.parse_performances_from_file(source)
    else:
        print("Error: No URL or file path provided.")
        sys.exit(1)

    try:
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
