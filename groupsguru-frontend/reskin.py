import os
import re

directories = ['app', 'components', 'lib']

replacements = [
    # General specific tokens from spec
    (r'bg-\[\#0[a-f0-9]{5}\]|bg-\[\#1[a-f0-9]{5}\]|bg-\[\#0c051a\]|bg-\[\#0a0114\]|bg-\[\#0f051d\]|bg-\[\#0f071a\]|bg-\[\#12081f\]|bg-\[\#1a0b2e\]', 'bg-[#1C1917]'),
    (r'border-(purple|indigo|pink|violet|white)-[0-9]{3}(\/[0-9]+)?', 'border-[#57534E]/40'),
    (r'border-white/10', 'border-[#57534E]/40'),
    
    # Text gradients (must be before solid gradients)
    (r'bg-gradient-to-[a-z]+\s+from-[^\s]+\s+(via-[^\s]+\s+)?to-[^\s]+\s+bg-clip-text\s+text-transparent', 'text-[#F97316]'),
    
    # Solid gradients -> solid orange
    (r'bg-gradient-to-[a-z]+\s+from-[^\s]+\s+(via-[^\s]+\s+)?to-[^\s]+', 'bg-[#EA580C]'),
    
    # Text colors
    (r'text-(purple|indigo|pink|violet)-[0-9]{3}(\/[0-9]+)?', 'text-[#F97316]'),
    (r'text-\[\#9333EA\]|text-\[\#DB2777\]|text-\[\#EC4899\]', 'text-[#F97316]'),
    
    # Backgrounds
    # Very dark transparent colors to surface color
    (r'bg-(purple|indigo|pink|violet)-9([0-9]{2})(\/[0-9]+)?', 'bg-[#292524]'),
    # Other solid backgrounds to base or accent
    (r'bg-(purple|indigo|pink|violet)-[0-9]{3}(\/[0-9]+)?', 'bg-[#EA580C]'),
    
    # Border
    (r'border-(purple|indigo|pink|violet)-[0-9]{3}(\/[0-9]+)?', 'border-[#57534E]/40'),
    
    # Caret
    (r'caret-(purple|indigo|pink|violet)-[0-9]{3}', 'caret-[#EA580C]'),
    
    # Hover states (text)
    (r'hover:text-(purple|indigo|pink|violet)-[0-9]{3}', 'hover:text-[#F97316]'),
    # Hover states (bg)
    (r'hover:bg-(purple|indigo|pink|violet)-[0-9]{3}(\/[0-9]+)?', 'hover:bg-[#EA580C]'),
    
    # Group hover
    (r'group-hover:text-(purple|indigo|pink|violet)-[0-9]{3}', 'group-hover:text-[#F97316]'),

    # Shadows
    (r'shadow-(purple|indigo|pink|violet)-[0-9]{3}(\/[0-9]+)?', ''),
    (r'shadow-\[.*?rgba\(147,51,234,.*?\)\]', 'shadow-md'),
    (r'shadow-\[.*?rgba.*?\]', 'shadow-md'), # Catch any other custom colored shadows
    
    # Radii
    (r'rounded-\[48px\]|rounded-\[32px\]|rounded-\[24px\]', 'rounded-xl'),
    
    # Blurs and filters
    (r'backdrop-blur-[a-z0-9\[\]]+', ''),
    (r'blur-[a-z0-9\[\]]+', ''),
    
    # Animation properties
    (r'font-black\s+italic', 'font-semibold'),
    (r'stiffness:\s*420,\s*damping:\s*24,\s*mass:\s*0\.8', 'duration: 0.25, ease: "easeOut"'),
    (r'whileHover=\{\{\s*y:\s*-10\s*\}\}', 'whileHover={{ y: -2 }}'),
    
    # Hex codes explicitly mentioned
    (r'#EC4899', '#EF4444'),
    (r'#9333EA', '#EA580C'),
    (r'#DB2777', '#EA580C'),
    
    (r'text-white', 'text-[#FAFAF9]')
]

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    for pattern, repl in replacements:
        new_content = re.sub(pattern, repl, new_content)
        
    # Clean up double spaces or floating classes resulting from removals
    new_content = re.sub(r'\s+', ' ', new_content).replace('className=" "', 'className=""')

    # However, running re.sub with `\s+` across the ENTIRE file destroys newlines!
    # Let me do it properly. We only want to collapse spaces within classNames.
    pass

def process_file_safe(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    for pattern, repl in replacements:
        new_content = re.sub(pattern, repl, new_content)
        
    # Clean up double spaces left from removed backdrop-blur inside className=" ... "
    # We can just let tailwind ignore double spaces.

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Modified: {filepath}")

for d in directories:
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                process_file_safe(os.path.join(root, file))
