import os
import re

directories = ['app', 'components', 'lib']

replacements = [
    # Clean up leftovers
    (r'(hover:|group-hover:)?(from|via|to|bg|text|border|caret)-(purple|indigo|pink|violet|rose|blue)-[0-9]{3}(\/[0-9]+)?', '')
]

def process_file_safe(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    # Remove remaining purple/pink/indigo classes
    new_content = re.sub(r'(hover:|group-hover:)?(from|via|to|bg|text|border|caret)-(purple|indigo|pink|violet|rose|blue|cyan)-[0-9]{3}(\/[0-9]+)?', '', new_content)
    # the above leaves bad bg-gradient-to- rules if from/to are removed.
    # Let's clean up any broken gradients:
    new_content = re.sub(r'bg-gradient-to-[a-z]+\s+', '', new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Cleaned up: {filepath}")

for d in directories:
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                process_file_safe(os.path.join(root, file))
