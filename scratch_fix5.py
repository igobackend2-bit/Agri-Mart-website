import re

with open(r'd:\Igo-websites\Igo-AgriMart\src\components\AdminComponent.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I need to wrap the bodies of `activeOverrideSection === '...' && (` with `<>` and `</>`.
# Wait, I can just replace `&& (\n` with `&& (\n<>\n` IF it is followed by a comment.
# Or better, just find all instances of `&& (\n` that we injected, and wrap the content.
# Since I only injected them for `activeOverrideSection ===`, I can do:

content = re.sub(r'({activeOverrideSection === \'.*?\' && \(\n)', r'\1<>\n', content)
content = re.sub(r'(          \)}\n)', r'</>\n\1', content)

# Wait, `          )}\n` might match other things. Let's be safer.
# We can just write a script to match:
# `{activeOverrideSection === '.*?' && \(\n` ... `          \)}\n`

def fix_fragments(match):
    header = match.group(1)
    body = match.group(2)
    footer = match.group(3)
    return header + "<>\n" + body + "</>\n" + footer

content = re.sub(r'(\{activeOverrideSection === \'.*?\' && \(\n)(.*?)(          \)}\n)', fix_fragments, content, flags=re.DOTALL)

with open(r'd:\Igo-websites\Igo-AgriMart\src\components\AdminComponent.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed fragments")
