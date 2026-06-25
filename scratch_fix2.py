import re

with open(r'd:\Igo-websites\Igo-AgriMart\src\components\AdminComponent.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We want to replace each `) : activeOverrideSection === '...' ? (`
# with `) : activeOverrideSection === '...' ? (<>`
# EXCEPT if it's followed by `<>` already, which Site Notification Bar is.
content = re.sub(r'\) : activeOverrideSection === \'(.*?)\' \?\ \(\n(?!\s*<>)', r') : activeOverrideSection === \'\1\' ? (\n<>\n', content)

# Now we need to close the fragments.
# We look for the NEXT `) : activeOverrideSection ===` or `) : (`
# and prepend `</>\n` before the indent.

lines = content.split('\n')
out_lines = []
for i in range(len(lines)):
    line = lines[i]
    if line.strip().startswith(") : activeOverrideSection ===") or line.strip() == ") : (":
        # Check if the previous block was wrapped
        # The block was wrapped if it's one of our new ones. We know the ones we injected.
        # Actually, let's just use regex on the whole content block.
        pass
    out_lines.append(line)

# Let's do it using regex on the whole content.
# Match: `) : activeOverrideSection === 'Some Text' ? (\n<>\n`
# all the way until `\n                  ) :`
# and insert `</>` right before the `\n                  ) :`

def add_closing_tags(match):
    inner = match.group(1)
    # Check if inner already has a closing tag at the end
    if not inner.rstrip().endswith('</>'):
        return inner + "\n</>"
    return inner

content = re.sub(r'(\) : activeOverrideSection === \'.*?\' \?\ \(\n<>\n.*?)(?=\n\s*\) : )', add_closing_tags, content, flags=re.DOTALL)

with open(r'd:\Igo-websites\Igo-AgriMart\src\components\AdminComponent.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed syntax")
