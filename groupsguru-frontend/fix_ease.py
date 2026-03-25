import os
import re

directories = ['app', 'components', 'lib']

def process_file_safe(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = re.sub(r'ease:\s*["\']easeOut["\'](?! as const)', 'ease: "easeOut" as const', content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed ease type in: {filepath}")

for d in directories:
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                process_file_safe(os.path.join(root, file))
