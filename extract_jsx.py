import sys
import re

def convert_to_jsx(html):
    # Basic replacements
    jsx = html.replace('class="', 'className="')
    jsx = jsx.replace('for="', 'htmlFor="')
    jsx = jsx.replace('stroke-width="', 'strokeWidth="')
    jsx = jsx.replace('stroke-linecap="', 'strokeLinecap="')
    jsx = jsx.replace('stroke-linejoin="', 'strokeLinejoin="')
    jsx = jsx.replace('fill-rule="', 'fillRule="')
    jsx = jsx.replace('clip-rule="', 'clipRule="')
    
    # Self-closing tags
    jsx = re.sub(r'<(img|input|br|hr|path|animate|svg)([^>]*?)(?<!/)>', r'<\1\2 />', jsx)
    
    # Special double fix for SVGs ending up as <svg ...> ... </svg />
    jsx = re.sub(r'</(img|input|br|hr|path|animate|svg)>', '', jsx) # wait, svg has children! Don't self close svg.
    
    return jsx

def main():
    if len(sys.argv) < 3:
        print("Usage: extract_jsx.py <input.html> <output.tsx>")
        return
        
    with open(sys.argv[1], 'r', encoding='utf-8') as f:
        html = f.read()
        
    # extract body content if possible
    body_match = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL | re.IGNORECASE)
    if body_match:
        html = body_match.group(1)
        
    # Re-write the SVG self-closing carefully:
    jsx = html.replace('class="', 'className="')
    jsx = jsx.replace('for="', 'htmlFor="')
    jsx = jsx.replace('stroke-width="', 'strokeWidth="')
    jsx = jsx.replace('stroke-linecap="', 'strokeLinecap="')
    jsx = jsx.replace('stroke-linejoin="', 'strokeLinejoin="')
    jsx = jsx.replace('fill-rule="', 'fillRule="')
    jsx = jsx.replace('clip-rule="', 'clipRule="')
    jsx = jsx.replace('tabindex="', 'tabIndex="')
    jsx = jsx.replace('readonly', 'readOnly')
    # Self closing only for these simple ones
    jsx = re.sub(r'<(img|input|br|hr|path)([^>]*?)(?<!/)>', r'<\1\2 />', jsx)
    jsx = re.sub(r'</(img|input|br|hr|path)>', '', jsx) 
    
    # remove comments
    jsx = re.sub(r'<!--(.*?)-->', '', jsx, flags=re.DOTALL)
    
    with open(sys.argv[2], 'w', encoding='utf-8') as f:
        f.write(jsx)

if __name__ == "__main__":
    main()
