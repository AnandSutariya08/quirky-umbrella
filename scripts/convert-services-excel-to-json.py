#!/usr/bin/env python3
"""
Script to convert Excel file to JSON format matching Service structure
"""

import json
import sys
import os
from pathlib import Path

try:
    import pandas as pd
except ImportError:
    print("Error: pandas is required. Install it with: pip install pandas openpyxl")
    sys.exit(1)

def generate_slug(title):
    """Generate a URL-friendly slug from title"""
    if not title:
        return ""
    slug = title.lower()
    slug = slug.replace(" ", "-")
    slug = "".join(c for c in slug if c.isalnum() or c == "-")
    slug = "-".join(slug.split())
    return slug

def parse_excel_to_services(excel_path):
    """Parse Excel file and convert to Service JSON structure"""
    
    # Read Excel file
    try:
        df = pd.read_excel(excel_path, sheet_name=0)
    except Exception as e:
        print(f"Error reading Excel file: {e}")
        sys.exit(1)
    
    # Display column names for debugging
    print("Excel columns found:")
    print(df.columns.tolist())
    print("\nFirst few rows:")
    print(df.head())
    print("\n")
    
    services = []
    
    # The Excel structure has service names as columns
    # Each column represents a service, and rows contain the content
    for col_name in df.columns:
        title = str(col_name).strip()
        
        if not title or title == "nan":
            continue
        
        # Get the content from the first row (index 0)
        content = ""
        if len(df) > 0 and not pd.isna(df[col_name].iloc[0]):
            content = str(df[col_name].iloc[0]).strip()
        
        # Generate slug from title
        slug = generate_slug(title)
        
        # Parse content - it might contain multiple paragraphs separated by \n\n
        paragraphs = [p.strip() for p in content.split('\n\n') if p.strip()]
        
        # First paragraph is usually the description/tagline
        description = paragraphs[0] if paragraphs else f"Comprehensive {title.lower()} solutions tailored to your business needs."
        tagline = description[:100] + "..." if len(description) > 100 else description
        
        # Build service object matching the Service interface
        service = {
            "title": title,
            "slug": slug,
            "tagline": tagline,
            "description": description,
            "whatIsIt": {
                "title": f"What is {title}?",
                "content": description
            },
            "deliverables": {
                "title": f"What Our {title} Services Deliver",
                "items": [
                    {"text": f"Customized {title.lower()} solutions"},
                    {"text": "Expert consultation and support"},
                    {"text": "Ongoing maintenance and optimization"}
                ]
            },
            "approach": {
                "title": "Our Approach",
                "content": f"We take a strategic approach to {title.lower()}, ensuring your business gets the most value from our services.",
                "processTitle": "Our process includes",
                "processSteps": [
                    {"text": "Initial consultation and needs assessment"},
                    {"text": "Custom solution design and planning"},
                    {"text": "Implementation and deployment"},
                    {"text": "Ongoing support and optimization"}
                ]
            },
            "useCases": {
                "title": f"{title} Use Cases Across Industries",
                "industries": [
                    {
                        "title": "Technology",
                        "items": [
                            f"Streamline {title.lower()} processes",
                            "Enhance operational efficiency"
                        ]
                    },
                    {
                        "title": "Healthcare",
                        "items": [
                            f"Improve {title.lower()} workflows",
                            "Ensure compliance and security"
                        ]
                    }
                ]
            },
            "cta": {
                "title": f"Ready to Get Started with {title}?",
                "content": f"Contact us today to learn how our {title.lower()} services can transform your business.",
                "buttonText": f"Book a {title} Consultation"
            },
            "faqs": [
                {
                    "question": f"What is included in your {title.lower()} services?",
                    "answer": f"Our {title.lower()} services include comprehensive consultation, custom solution design, implementation, and ongoing support."
                },
                {
                    "question": f"How long does it take to implement {title.lower()}?",
                    "answer": "Implementation timelines vary based on your specific needs and requirements. We'll provide a detailed timeline during our initial consultation."
                }
            ],
            "isActive": True
        }
        
        services.append(service)
    
    return services

def main():
    # Get the Excel file path
    script_dir = Path(__file__).parent
    excel_path = script_dir.parent / "src" / "Untitled spreadsheet.xlsx"
    
    if not excel_path.exists():
        print(f"Error: Excel file not found at {excel_path}")
        print("Please ensure the file exists at: src/Untitled spreadsheet.xlsx")
        sys.exit(1)
    
    print(f"Reading Excel file: {excel_path}")
    
    # Parse Excel to services
    services = parse_excel_to_services(excel_path)
    
    if not services:
        print("Warning: No services found in Excel file")
        sys.exit(1)
    
    # Output JSON file
    output_path = script_dir / "seed-services.json"
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(services, f, indent=2, ensure_ascii=False)
    
    print(f"\nSuccessfully converted {len(services)} services to JSON")
    print(f"Output file: {output_path}")
    print(f"\nServices created:")
    for i, service in enumerate(services, 1):
        print(f"  {i}. {service['title']} (slug: {service['slug']})")

if __name__ == "__main__":
    main()
