import re
import sys
import glob

def apply_obsidian_tokens(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    replacements = [
        # text colors
        ('text-slate-900', 'text-on-surface'),
        ('text-slate-800', 'text-on-surface'),
        ('text-slate-500', 'text-on-surface-variant'),
        ('text-slate-400', 'text-on-surface-variant'),
        ('text-slate-200', 'text-outline-variant'),
        
        # bg colors
        ('bg-slate-50', 'bg-surface-bright'),
        ('bg-white', 'bg-surface-container-lowest'),
        ('bg-slate-900', 'bg-primary'),
        ('bg-slate-800', 'bg-primary/90'),
        
        # borders
        ('border-slate-200', 'border-outline-variant/20'),
        ('border-slate-300', 'border-outline-variant/30'),
        
        # specific card/container classes
        ('rounded-lg', 'rounded-xl'),
        ('rounded-2xl', 'rounded-xl'), # standard is 24px which is 1.5rem (xl in new tailwind config? Wait, in globals.css, rounded-xl is sometimes different. Usually 24px is rounded-[24px] or rounded-xl)
        
        # specific layout spacing
        ('p-10 max-w-7xl', 'p-container-padding max-w-[1440px]'),
        
        # replace typography font families
        ('font-display', 'font-headline-md'),
    ]

    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    for f in glob.glob("src/app/*/page.tsx"):
        print(f"Applying tokens to {f}")
        apply_obsidian_tokens(f)
