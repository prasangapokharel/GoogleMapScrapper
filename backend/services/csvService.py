import csv
import io
from typing import List, Dict, Any


def generate_csv(businesses: List[Dict[str, Any]]) -> str:
    headers = [
        "name",
        "phone",
        "email",
        "website",
        "google_maps_url",
        "address",
        "rating",
        "category",
    ]

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=headers, extrasaction="ignore")
    writer.writeheader()

    for business in businesses:
        row = {header: business.get(header, "") for header in headers}
        writer.writerow(row)

    return output.getvalue()


def generate_csv_bytes(businesses: List[Dict[str, Any]]) -> bytes:
    csv_content = generate_csv(businesses)
    return csv_content.encode("utf-8-sig")
