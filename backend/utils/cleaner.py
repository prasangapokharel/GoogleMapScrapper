def normalize_phone(phone: str) -> str:
    if not phone:
        return ""
    phone = "".join(filter(str.isdigit, phone))
    return phone


def normalize_url(url: str) -> str:
    if not url:
        return ""
    url = url.strip()
    if url and not url.startswith(("http://", "https://")):
        url = "https://" + url
    return url


def normalize_text(text: str) -> str:
    if not text:
        return ""
    return text.strip().lower()


def is_duplicate(business1: dict, business2: dict) -> bool:
    name1 = normalize_text(business1.get("name", ""))
    name2 = normalize_text(business2.get("name", ""))
    phone1 = normalize_phone(business1.get("phone", ""))
    phone2 = normalize_phone(business2.get("phone", ""))

    if name1 and name2 and name1 == name2:
        return True

    if phone1 and phone2 and phone1 == phone2 and len(phone1) >= 7:
        return True

    return False


def deduplicate_businesses(businesses: list) -> list:
    unique_businesses = []
    for business in businesses:
        is_dup = False
        for existing in unique_businesses:
            if is_duplicate(business, existing):
                is_dup = True
                break
        if not is_dup:
            unique_businesses.append(business)
    return unique_businesses


def clean_business(business: dict) -> dict:
    cleaned = {
        "name": business.get("name", "").strip(),
        "phone": normalize_phone(business.get("phone", "")),
        "email": business.get("email", "").strip().lower(),
        "website": normalize_url(business.get("website", "")),
        "google_maps_url": normalize_url(business.get("google_maps_url", "")),
        "address": business.get("address", "").strip(),
        "rating": float(business.get("rating", 0)) if business.get("rating") else None,
        "category": business.get("category", "").strip(),
    }

    if not cleaned["name"]:
        return None

    if cleaned["rating"] == 0:
        cleaned["rating"] = None

    return cleaned


def clean_and_deduplicate(businesses: list) -> list:
    cleaned = [clean_business(b) for b in businesses if b]
    cleaned = [b for b in cleaned if b is not None]
    deduplicated = deduplicate_businesses(cleaned)
    return deduplicated
