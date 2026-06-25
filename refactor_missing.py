import sys

with open(r'd:\Igo-websites\Igo-AgriMart\src\components\AdminComponent.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_content = content.find("{activeTab === 'Content' && (")
end_content = content.find("{activeTab === 'Settings' && (")

if start_content == -1 or end_content == -1:
    sys.exit(1)

content_tab = content[start_content:end_content]

sections = [
    ("Upcoming Agri Events", "{/* Upcoming Agri Events editor */}"),
    ("IGO Category Bands", "{/* Home Page Text — IGO category bands */}"),
    ("Value Cards", "{/* Home Page Text — value cards */}"),
    ("Card Stats & Trust Points", "{/* Home Page Text — card stats & trust points */}"),
    ("Trust Section & Stats Bar", "{/* Home Page Text — \"Why India's Farmers Trust IGO\" + stats bar */}")
]

def find_div_bounds(text, search_text):
    text_pos = text.find(search_text)
    if text_pos == -1: return -1, -1
    
    div_start_text = '<div className="bg-white border border-slate-200 rounded-xl p-5">'
    # Search for the div STARTING from text_pos!
    start_pos = text.find(div_start_text, text_pos)
    if start_pos == -1: return -1, -1

    open_count = 0
    i = start_pos
    while i < len(text):
        if text.startswith('<div', i):
            open_count += 1
        elif text.startswith('</div', i):
            open_count -= 1
            if open_count == 0:
                end_pos = i + len('</div>')
                return start_pos, end_pos
        i += 1
    return -1, -1

extracted_blocks = {}
for name, marker in sections:
    start, end = find_div_bounds(content_tab, marker)
    if start != -1:
        # Include the comment
        comment_start = content_tab.rfind("{/*", 0, start)
        if comment_start != -1 and comment_start >= content_tab.rfind("</div>", 0, start):
            start = comment_start
        
        block_str = content_tab[start:end]
        block_str = "{activeOverrideSection === '" + name + "' && (\n" + block_str + "\n)}\n"
        extracted_blocks[name] = block_str
        
        # Replace with empty
        content_tab = content_tab[:start] + content_tab[end:]

# Now inject these blocks RIGHT AFTER the Dropdown block.
# Wait, where is the Dropdown block?
dropdown_marker = '<h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">\n              Homepage Section Overrides'

start_dropdown, end_dropdown = find_div_bounds(content_tab, dropdown_marker)

# We want to insert the extracted forms directly AFTER the Dropdown div!
if start_dropdown != -1 and end_dropdown != -1:
    payload = "\n"
    for name, _ in sections:
        payload += extracted_blocks.get(name, "")
    
    content_tab = content_tab[:end_dropdown] + payload + content_tab[end_dropdown:]

final_content = content[:start_content] + content_tab + content[end_content:]

with open(r'd:\Igo-websites\Igo-AgriMart\src\components\AdminComponent.tsx', 'w', encoding='utf-8') as f:
    f.write(final_content)

print("Fixed missing blocks")
