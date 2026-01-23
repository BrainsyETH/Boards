#!/usr/bin/env python3
"""
FloatMissouri River Data Scraper v2
===================================
Scrapes river mile marker data from floatmissouri.com for the Missouri River Float Planner project.

Output: JSON files ready for Supabase/PostGIS ingestion

Usage:
    python scrape_floatmissouri.py

Dependencies:
    pip install requests beautifulsoup4
"""

import json
import re
import time
from dataclasses import dataclass, asdict
from typing import Optional
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://www.floatmissouri.com"
RIVERS_INDEX_URL = f"{BASE_URL}/plan/missouri-rivers/"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
}
REQUEST_DELAY = 1.0


@dataclass
class River:
    id: str
    name: str
    url: str
    difficulty: Optional[str] = None
    gradient_general: Optional[float] = None
    gradient_details: Optional[str] = None
    counties: list = None
    description: Optional[str] = None
    
    def __post_init__(self):
        if self.counties is None:
            self.counties = []


@dataclass
class MileMarker:
    river_id: str
    mile: float
    description: str
    raw_text: str
    feature_type: str
    is_access_point: bool = False
    is_campground: bool = False
    has_spring: bool = False
    has_bridge: bool = False
    is_hazard: bool = False
    side: Optional[str] = None
    highway: Optional[str] = None
    notes: Optional[str] = None


# Noise patterns to filter out (version numbers, CSS, etc)
NOISE_PATTERNS = [
    'http', 'woo', 'plugin', 'responsive', 'schema', 'yoast', 
    'mobile', 'slider', 'wordpress', 'jquery', 'css', 'font',
    'script', 'widget', 'theme', 'ajax', 'admin', 'content',
    'px', 'em', 'rem', '%', 'rgb', 'rgba', 'var(', 'calc(',
    'function', 'return', 'const', 'let', 'var ', '{', '}',
    'true', 'false', 'null', 'undefined'
]


def is_valid_description(desc: str) -> bool:
    """Filter out noise from regex matches"""
    if len(desc) < 10:
        return False
    if desc[0] == '-':
        return False
    desc_lower = desc.lower()
    return not any(noise in desc_lower for noise in NOISE_PATTERNS)


def classify_feature(text: str) -> tuple[str, dict]:
    """Classify feature type and extract metadata"""
    text_lower = text.lower()
    metadata = {
        'is_access_point': False,
        'is_campground': False,
        'has_spring': False,
        'has_bridge': False,
        'is_hazard': False,
        'side': None,
        'highway': None,
    }
    
    # Determine side
    if ' on left' in text_lower or ' on the left' in text_lower or ', left' in text_lower:
        metadata['side'] = 'left'
    elif ' on right' in text_lower or ' on the right' in text_lower or ', right' in text_lower:
        metadata['side'] = 'right'
    
    # Extract highway
    hwy_match = re.search(r'(?:Hwy\.?|Highway|State Hwy\.?|U\.?S\.? Hwy\.?)\s*([A-Z0-9-]+)', text, re.IGNORECASE)
    if hwy_match:
        metadata['highway'] = hwy_match.group(1)
    
    feature_type = 'other'
    
    # Hazards
    if any(kw in text_lower for kw in ['dam', 'portage', 'do not run', 'dangerous', 'impassable']):
        metadata['is_hazard'] = True
        feature_type = 'hazard'
    
    # Access points
    if any(kw in text_lower for kw in ['access', 'put-in', 'take-out', 'takeout', 'put in', 'take out', 'ramp', 'landing']):
        metadata['is_access_point'] = True
        if feature_type == 'other':
            feature_type = 'access'
    
    # Campgrounds
    if any(kw in text_lower for kw in ['campground', 'campsite', 'camp site', 'camping', 'camp area', 'recreation area']):
        metadata['is_campground'] = True
        if feature_type == 'other':
            feature_type = 'campground'
    
    # Springs
    if 'spring' in text_lower and 'spring branch' not in text_lower:
        metadata['has_spring'] = True
        if feature_type == 'other':
            feature_type = 'spring'
    
    # Bridges
    if any(kw in text_lower for kw in ['bridge', 'r.r.', 'railroad']):
        metadata['has_bridge'] = True
        if feature_type == 'other':
            feature_type = 'bridge'
    
    # Creeks
    if any(kw in text_lower for kw in ['creek', 'fork', 'branch', 'river', 'hollow']) and feature_type == 'other':
        feature_type = 'creek'
    
    # Landmarks
    if any(kw in text_lower for kw in ['bluff', 'cave', 'rock', 'island', 'mountain', 'falls', 'shut-in']) and feature_type == 'other':
        feature_type = 'landmark'
    
    return feature_type, metadata


def parse_mile_markers_from_html(html: str, river_id: str) -> list[MileMarker]:
    """Parse mile markers directly from raw HTML"""
    pattern = r'(\d+\.\d+)\s+([^<]+)'
    matches = re.findall(pattern, html)
    
    markers = []
    seen = set()
    
    for mile_str, desc in matches:
        desc = desc.strip()
        
        if not is_valid_description(desc):
            continue
        
        mile = float(mile_str)
        
        # Dedupe
        key = (mile, desc[:50])
        if key in seen:
            continue
        seen.add(key)
        
        feature_type, metadata = classify_feature(desc)
        
        marker = MileMarker(
            river_id=river_id,
            mile=mile,
            description=desc,
            raw_text=f"{mile_str} {desc}",
            feature_type=feature_type,
            **metadata
        )
        markers.append(marker)
    
    return sorted(markers, key=lambda x: x.mile)


def parse_river_metadata(html: str, soup: BeautifulSoup, river_id: str, river_name: str, url: str) -> River:
    """Extract river metadata"""
    river = River(id=river_id, name=river_name, url=url)
    
    text = soup.get_text()
    
    # Difficulty
    diff_match = re.search(r'Difficulty:\s*([IVX,\s]+(?:occasionally\s+[IVX]+)?)', text, re.IGNORECASE)
    if diff_match:
        river.difficulty = diff_match.group(1).strip()
    
    # Gradients
    grad_match = re.search(r'Gradients?:\s*([^C\n]+?)(?=Counties|$)', text, re.IGNORECASE | re.DOTALL)
    if grad_match:
        gradient_text = grad_match.group(1).strip()
        river.gradient_details = gradient_text
        general_match = re.search(r'general\s*[-–]\s*(\d+\.?\d*)', gradient_text, re.IGNORECASE)
        if general_match:
            try:
                river.gradient_general = float(general_match.group(1))
            except ValueError:
                pass
    
    # Counties
    counties_match = re.search(r'Counties?:\s*([A-Za-z,\s]+?)(?:\.|$|\n)', text, re.IGNORECASE)
    if counties_match:
        counties_text = counties_match.group(1).strip()
        river.counties = [c.strip() for c in counties_text.split(',') if c.strip()]
    
    # Description from og:description meta tag
    og_desc = soup.find('meta', property='og:description')
    if og_desc and og_desc.get('content'):
        river.description = og_desc['content'][:500]
    
    return river


def get_river_links(session: requests.Session) -> list[tuple[str, str, str]]:
    """Get all river page links from index"""
    print(f"Fetching river index: {RIVERS_INDEX_URL}")
    
    resp = session.get(RIVERS_INDEX_URL, headers=HEADERS)
    resp.raise_for_status()
    
    soup = BeautifulSoup(resp.text, 'html.parser')
    rivers = []
    
    for link in soup.find_all('a', href=True):
        href = link.get('href', '')
        
        if '/missouri-rivers/' in href and href != '/plan/missouri-rivers/' and 'missouri-rivers/' in href:
            name = link.get_text().strip()
            if not name or len(name) < 3:
                continue
            
            if href.startswith('http'):
                full_url = href
            else:
                full_url = urljoin(BASE_URL, href)
            
            river_id_match = re.search(r'/missouri-rivers/([^/]+)/?$', full_url)
            if river_id_match:
                river_id = river_id_match.group(1)
                if not any(r[2] == river_id for r in rivers):
                    rivers.append((name, full_url, river_id))
    
    print(f"Found {len(rivers)} rivers")
    return rivers


def scrape_river_page(session: requests.Session, name: str, url: str, river_id: str) -> tuple[River, list[MileMarker]]:
    """Scrape a single river page"""
    print(f"  Scraping: {name}")
    
    resp = session.get(url, headers=HEADERS)
    resp.raise_for_status()
    
    soup = BeautifulSoup(resp.text, 'html.parser')
    
    river = parse_river_metadata(resp.text, soup, river_id, name, url)
    markers = parse_mile_markers_from_html(resp.text, river_id)
    
    print(f"    Found {len(markers)} mile markers")
    
    return river, markers


def main():
    print("=" * 60)
    print("FloatMissouri River Data Scraper v2")
    print("=" * 60)
    print()
    
    session = requests.Session()
    river_links = get_river_links(session)
    
    all_rivers = []
    all_markers = []
    
    print()
    print("Scraping individual river pages...")
    print("-" * 40)
    
    for i, (name, url, river_id) in enumerate(river_links, 1):
        try:
            river, markers = scrape_river_page(session, name, url, river_id)
            all_rivers.append(river)
            all_markers.extend(markers)
        except Exception as e:
            print(f"    ERROR: {e}")
        
        if i < len(river_links):
            time.sleep(REQUEST_DELAY)
    
    print()
    print("-" * 40)
    print(f"Total rivers: {len(all_rivers)}")
    print(f"Total mile markers: {len(all_markers)}")
    
    # Convert to dicts
    rivers_data = [asdict(r) for r in all_rivers]
    markers_data = [asdict(m) for m in all_markers]
    
    # Save files
    with open('floatmissouri_rivers.json', 'w') as f:
        json.dump(rivers_data, f, indent=2)
    print(f"\nSaved: floatmissouri_rivers.json")
    
    with open('floatmissouri_mile_markers.json', 'w') as f:
        json.dump(markers_data, f, indent=2)
    print(f"Saved: floatmissouri_mile_markers.json")
    
    # Combined by river
    combined = {}
    for river in all_rivers:
        river_markers = [m for m in markers_data if m['river_id'] == river.id]
        combined[river.id] = {
            'metadata': asdict(river),
            'mile_markers': sorted(river_markers, key=lambda x: x['mile'])
        }
    
    with open('floatmissouri_combined.json', 'w') as f:
        json.dump(combined, f, indent=2)
    print(f"Saved: floatmissouri_combined.json")
    
    # Summary
    print("\n" + "=" * 40)
    print("Mile Markers by Feature Type:")
    print("-" * 40)
    
    feature_counts = {}
    for m in all_markers:
        ft = m.feature_type
        feature_counts[ft] = feature_counts.get(ft, 0) + 1
    
    for ft, count in sorted(feature_counts.items(), key=lambda x: -x[1]):
        print(f"  {ft}: {count}")
    
    # Access points count
    access_count = sum(1 for m in all_markers if m.is_access_point)
    print(f"\nTotal access points: {access_count}")
    
    print("\nDone!")


if __name__ == '__main__':
    main()
