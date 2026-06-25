import sys

with open(r'd:\Igo-websites\Igo-AgriMart\src\components\AdminComponent.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# The error is that the injected cases return multiple sibling elements.
# E.g.
# ) : activeOverrideSection === 'Upcoming Agri Events' ? (
# <h4...>
# <p...>
# <div>...
#
# We need to wrap them in <> ... </>

output = []
in_override_block = False

for i in range(len(lines)):
    line = lines[i]
    if ") : activeOverrideSection ===" in line:
        output.append(line)
        # Next line should be the start of the fragment
        output.append("<>\n")
        in_override_block = True
    elif in_override_block and line.strip() == ") : activeOverrideSection === 'Site Notification Bar' ? (":
        # we already did site notif bar correctly in python script?
        # Let's check how site notif bar was added: `) : activeOverrideSection === 'Site Notification Bar' ? (\n            <>\n`
        # We don't want to double wrap if it's already wrapped.
        pass
    else:
        # Wait, how to know when to close the fragment?
        # The closing is before the next `) : activeOverrideSection ===` or `) : (`
        if line.strip().startswith(") : activeOverrideSection ===") or line.strip() == ") : (":
            if in_override_block:
                output.insert(-1, "</>\n") # before the current line
        output.append(line)

with open(r'd:\Igo-websites\Igo-AgriMart\scratch_fix.py', 'w') as f:
    f.write("import re\n")
