import os
import re

directories = ['app', 'components', 'lib']

replacements = [
    # Spring animations inside framer-motion props
    (r'type:\s*["\']spring["\'](?:\s*as\s*const)?,\s*stiffness:\s*\d+,\s*damping:\s*\d+(?:,\s*mass:\s*[\d.]+)?', 'duration: 0.25, ease: "easeOut"'),
    (r'type:\s*["\']spring["\'](?:\s*as\s*const)?,\s*damping:\s*\d+,\s*stiffness:\s*\d+', 'duration: 0.25, ease: "easeOut"'),
    # font-black -> font-bold
    (r'font-black', 'font-bold'),
    # string "italic" in classes
    (r'\bitalic\b', '')
]

def process_file_safe(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    for pattern, repl in replacements:
        new_content = re.sub(pattern, repl, new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Cleaned up 2: {filepath}")

for d in directories:
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                process_file_safe(os.path.join(root, file))
