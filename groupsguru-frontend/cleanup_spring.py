import os
import re

directories = ['app', 'components', 'lib']

def process_file_safe(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = re.sub(r'type:\s*["\']spring["\'](?:\s*as\s*const)?\s*,?', '', content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Removed spring type: {filepath}")

for d in directories:
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                process_file_safe(os.path.join(root, file))
