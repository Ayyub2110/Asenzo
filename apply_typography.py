import sys
import re

with open('asenzo-frontend/src/app/globals.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Make sure we don't duplicate
if ".text-headline-lg" not in css:
    append_css = """
/* STITCH TYPOGRAPHY CLASSES */
.text-headline-lg, .font-headline-lg { font-family: 'Inter', sans-serif; font-size: 32px; line-height: 38px; letter-spacing: -0.019em; font-weight: 600; }
.text-label-sm, .font-label-sm { font-family: 'Inter', sans-serif; font-size: 11px; line-height: 16px; letter-spacing: 0.02em; font-weight: 600; }
.text-headline-md, .font-headline-md { font-family: 'Inter', sans-serif; font-size: 24px; line-height: 30px; letter-spacing: -0.019em; font-weight: 600; }
.text-body-md, .font-body-md { font-family: 'Inter', sans-serif; font-size: 15px; line-height: 22px; letter-spacing: -0.009em; font-weight: 400; }
.text-label-md, .font-label-md { font-family: 'Inter', sans-serif; font-size: 13px; line-height: 18px; letter-spacing: 0.01em; font-weight: 500; }
.text-display-lg, .font-display-lg { font-family: 'Inter', sans-serif; font-size: 48px; line-height: 52px; letter-spacing: -0.022em; font-weight: 700; }
.text-display-lg-mobile, .font-display-lg-mobile { font-family: 'Inter', sans-serif; font-size: 34px; line-height: 40px; letter-spacing: -0.022em; font-weight: 700; }
.text-body-lg, .font-body-lg { font-family: 'Inter', sans-serif; font-size: 17px; line-height: 26px; letter-spacing: -0.011em; font-weight: 400; }

.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.ambient-shadow { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04); }
"""
    with open('asenzo-frontend/src/app/globals.css', 'w', encoding='utf-8') as f:
        f.write(css + append_css)
