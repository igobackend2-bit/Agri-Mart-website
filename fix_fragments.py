import sys

with open(r'd:\Igo-websites\Igo-AgriMart\src\components\AdminComponent.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the fragment missing
content = content.replace(
    "{activeOverrideSection === 'Upcoming Agri Events' && (\n{/*",
    "{activeOverrideSection === 'Upcoming Agri Events' && (<>\n{/*"
)
content = content.replace(
    "            </div>\n              <button onClick={saveHomeText} className=\"text-xs font-bold bg-[#1B6B3A] text-white px-4 py-1.5 rounded-lg hover:bg-emerald-950 mt-4\">Save Text</button>\n            </div>\n)}\n",
    "            </div>\n              <button onClick={saveHomeText} className=\"text-xs font-bold bg-[#1B6B3A] text-white px-4 py-1.5 rounded-lg hover:bg-emerald-950 mt-4\">Save Text</button>\n            </div>\n</>)}\n"
)

# Replace all fragments generally just in case:
import re
content = re.sub(r"\{activeOverrideSection === '([^']+)' && \(\n", r"{activeOverrideSection === '\1' && (<>\n", content)
content = re.sub(r"\n\)\}\n", r"\n</>)}\n", content)

with open(r'd:\Igo-websites\Igo-AgriMart\src\components\AdminComponent.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed fragments")
