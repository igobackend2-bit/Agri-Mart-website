import sys

with open(r'd:\Igo-websites\Igo-AgriMart\src\components\AdminComponent.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []

# Replace dropdown options inline
# Add buttons inline
# Wrap sections inline

sections = [
    ("Upcoming Agri Events", "{/* Upcoming Agri Events editor */}"),
    ("IGO Category Bands", "{/* Home Page Text — IGO category bands */}"),
    ("Value Cards", "{/* Home Page Text — value cards */}"),
    ("Card Stats & Trust Points", "{/* Home Page Text — card stats & trust points */}"),
    ("Trust Section & Stats Bar", "{/* Home Page Text — \"Why India's Farmers Trust IGO\" + stats bar */}"),
    ("Image Manager", "{/* Image Manager — swap key site images by URL or /images/ path */}"),
    ("Category Manager", "{/* Category Manager — rename categories, change their tile image, or hide them */}"),
    ("Marquee Banner Text", "<h4 className=\"font-extrabold text-xs text-slate-700 uppercase tracking-widest\">Marquee Banner Text</h4>"),
    ("Homepage Hero Banners", "<h4 className=\"font-extrabold text-xs text-slate-700 uppercase tracking-widest\">Homepage Hero Banners</h4>"),
    ("Site Notification Bar", "<h4 className=\"font-extrabold text-xs text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-1.5\">\n              <Bell className=\"h-3.5 w-3.5 text-[#E8A020]\" /> Site Notification Bar")
]

# We need a state machine
in_content_tab = False
current_section = None
div_depth = 0

for i, line in enumerate(lines):
    if "activeTab === 'Content'" in line:
        in_content_tab = True
    
    if in_content_tab:
        # Check if we are starting a section
        if current_section is None:
            for sec_name, sec_marker in sections:
                if sec_marker in line or (i < len(lines) - 1 and sec_marker in (line + lines[i+1])):
                    # We found a section start!
                    # Wait, if the marker is a comment, the `<div className="bg-white border...` is usually the next line.
                    # Let's just flag that we are looking for the div.
                    pass
        
        # Actually, simpler:
        pass

# The safest way is still string replacement, but targeted correctly.
content = "".join(lines)

# ONLY target inside the Content tab!
start_content = content.find("{activeTab === 'Content' && (")
end_content = content.find("{activeTab === 'Settings' && (")

if start_content == -1 or end_content == -1:
    print("Could not find content tab")
    sys.exit(1)

content_tab = content[start_content:end_content]

# 1. Update dropdown
old_dropdown = """<select value={activeOverrideSection} onChange={e => setActiveOverrideSection(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold outline-none focus:border-[#1B6B3A]">
                  <option value="">-- Choose a section --</option>
                  {['Best Selling', "Freshly Arrived", 'Shop By Crop', 'Seeds', 'Organic & Bio Inputs', 'Urban & Balcony Gardening', 'Animal Husbandry Essentials', 'Precision Tools & Equipments', 'Trending Products', 'Brands'].map(sec => (
                    <option key={sec} value={sec}>{sec} ({homeOverrides[sec]?.length || 0} items)</option>
                  ))}
                </select>"""

new_dropdown = """<select value={activeOverrideSection} onChange={e => setActiveOverrideSection(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold outline-none focus:border-[#1B6B3A]">
                  <option value="">-- Choose a section --</option>
                  <optgroup label="Content Override Forms">
                    {['Upcoming Agri Events', 'IGO Category Bands', 'Value Cards', 'Card Stats & Trust Points', 'Trust Section & Stats Bar', 'Image Manager', 'Category Manager', 'Marquee Banner Text', 'Homepage Hero Banners', 'Site Notification Bar'].map(sec => (
                       <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Product Assignments">
                    {['Best Selling', "Freshly Arrived", 'Shop By Crop', 'Seeds', 'Organic & Bio Inputs', 'Urban & Balcony Gardening', 'Animal Husbandry Essentials', 'Precision Tools & Equipments', 'Trending Products', 'Brands'].map(sec => (
                      <option key={sec} value={sec}>{sec} ({homeOverrides[sec]?.length || 0} items)</option>
                    ))}
                  </optgroup>
                </select>"""
content_tab = content_tab.replace(old_dropdown, new_dropdown)


# 2. Add individual buttons
content_tab = content_tab.replace(
    '<div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest mb-2">Card 1 — “Why farmers shop at IGO Agri Mart”</div>',
    '<div className="flex justify-between items-center mb-2"><div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest">Card 1 — “Why farmers shop at IGO Agri Mart”</div><div className="flex gap-2"><button onClick={saveHomeText} className="text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-2.5 py-1">Save</button><button onClick={() => resetHomeFields([\'card1_badge\', \'card1_title1\', \'card1_title2\', \'card1_p1\', \'card1_p2\', \'card1_panel_title\'])} className="text-[10px] font-bold text-rose-500 border border-rose-200 rounded px-2.5 py-1 hover:bg-rose-50">Delete</button></div></div>'
)
content_tab = content_tab.replace(
    '<div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest mb-2">Card 2 — “Why Farmers Trust IGO”</div>',
    '<div className="flex justify-between items-center mb-2"><div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest">Card 2 — “Why Farmers Trust IGO”</div><div className="flex gap-2"><button onClick={saveHomeText} className="text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-2.5 py-1">Save</button><button onClick={() => resetHomeFields([\'card2_badge\', \'card2_title1\', \'card2_title2\', \'card2_intro\'])} className="text-[10px] font-bold text-rose-500 border border-rose-200 rounded px-2.5 py-1 hover:bg-rose-50">Delete</button></div></div>'
)
content_tab = content_tab.replace(
    '<div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest mb-2">Card 1 — “The Agri Mart Advantage” stats</div>',
    '<div className="flex justify-between items-center mb-2"><div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest">Card 1 — “The Agri Mart Advantage” stats</div><div className="flex gap-2"><button onClick={saveHomeText} className="text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-2.5 py-1">Save</button><button onClick={() => resetHomeFields([1, 2, 3, 4, 5, 6].flatMap((i) => [`adv${i}_n`, `adv${i}_l`]))} className="text-[10px] font-bold text-rose-500 border border-rose-200 rounded px-2.5 py-1 hover:bg-rose-50">Delete</button></div></div>'
)
content_tab = content_tab.replace(
    '<div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest mb-2">Card 2 — “Why Farmers Trust IGO” points</div>',
    '<div className="flex justify-between items-center mb-2"><div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest">Card 2 — “Why Farmers Trust IGO” points</div><div className="flex gap-2"><button onClick={saveHomeText} className="text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-2.5 py-1">Save</button><button onClick={() => resetHomeFields([1, 2, 3, 4].flatMap((i) => [`trust${i}_t`, `trust${i}_d`]))} className="text-[10px] font-bold text-rose-500 border border-rose-200 rounded px-2.5 py-1 hover:bg-rose-50">Delete</button></div></div>'
)
content_tab = content_tab.replace(
    '<div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest mb-2">Section heading</div>',
    '<div className="flex justify-between items-center mb-2"><div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest">Section heading</div><div className="flex gap-2"><button onClick={saveHomeText} className="text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-2.5 py-1">Save</button><button onClick={() => resetHomeFields([\'trust_badge\', \'trust_title1\', \'trust_title2\', \'trust_sub\'])} className="text-[10px] font-bold text-rose-500 border border-rose-200 rounded px-2.5 py-1 hover:bg-rose-50">Delete</button></div></div>'
)
content_tab = content_tab.replace(
    '<div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest mb-2">6 feature cards</div>',
    '<div className="flex justify-between items-center mb-2"><div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest">6 feature cards</div><div className="flex gap-2"><button onClick={saveHomeText} className="text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-2.5 py-1">Save All</button><button onClick={() => resetHomeFields([1, 2, 3, 4, 5, 6].flatMap((i) => [`trustpt${i}_t`, `trustpt${i}_d`]))} className="text-[10px] font-bold text-rose-500 border border-rose-200 rounded px-2.5 py-1 hover:bg-rose-50">Delete All</button></div></div>'
)
content_tab = content_tab.replace(
    '<div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest mb-2">Stats bar</div>',
    '<div className="flex justify-between items-center mb-2"><div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest">Stats bar</div><div className="flex gap-2"><button onClick={saveHomeText} className="text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-2.5 py-1">Save</button><button onClick={() => resetHomeFields([\'statbar_title\', ...[1, 2, 3, 4].flatMap((i) => [`statbar${i}_n`, `statbar${i}_l`])])} className="text-[10px] font-bold text-rose-500 border border-rose-200 rounded px-2.5 py-1 hover:bg-rose-50">Delete</button></div></div>'
)
content_tab = content_tab.replace(
    '<label className="shrink-0 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg">\n                    Upload\n                    <input type="file" accept="image/*" className="hidden" onChange={(e) => readImageFile(e.target.files?.[0], (url) => setSiteImagesState({ ...siteImages, [slot.key]: url }))} />\n                  </label>',
    '<label className="shrink-0 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-1.5 rounded-lg">\n                    Upload\n                    <input type="file" accept="image/*" className="hidden" onChange={(e) => readImageFile(e.target.files?.[0], (url) => setSiteImagesState({ ...siteImages, [slot.key]: url }))} />\n                  </label>\n                  <button onClick={saveSiteImagesHandler} className="shrink-0 text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-3 py-1.5 ml-2">Save</button>'
)
content_tab = content_tab.replace(
    '                    <label className="flex items-center gap-1 text-[10px] font-bold text-slate-500 shrink-0">\n                      <input type="checkbox" checked={!!m.hidden} onChange={(e) => setCatField(c.name, \'hidden\', e.target.checked)} /> Hide\n                    </label>\n                  </div>',
    '                    <label className="flex items-center gap-1 text-[10px] font-bold text-slate-500 shrink-0">\n                      <input type="checkbox" checked={!!m.hidden} onChange={(e) => setCatField(c.name, \'hidden\', e.target.checked)} /> Hide\n                    </label>\n                    <button onClick={saveCategoryMetaHandler} className="shrink-0 text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-3 py-1.5 ml-2">Save</button>\n                  </div>'
)
content_tab = content_tab.replace(
    '<button onClick={() => setBanners(banners.map((x, idx) => idx === i ? { img: \'\', badge: \'\', title: \'\', sub: \'\', btn: \'Shop Now\', btnAction: \'seeds-saplings\' } : x))}\n                      className="text-[10px] text-red-500 font-bold hover:underline">Clear slot</button>',
    '<div className="flex items-center justify-between"><button onClick={() => setBanners(banners.map((x, idx) => idx === i ? { img: \'\', badge: \'\', title: \'\', sub: \'\', btn: \'Shop Now\', btnAction: \'seeds-saplings\' } : x))}\n                      className="text-[10px] text-rose-500 font-bold border border-rose-200 px-2 py-1 rounded hover:bg-rose-50">Delete</button><button onClick={handleSaveBanners} className="text-[10px] text-white bg-[#1B6B3A] hover:bg-emerald-950 font-bold px-3 py-1 rounded">Save</button></div>'
)

# 3. Remove global save buttons
content_tab = content_tab.replace(
    '<button onClick={saveHomeText} className="text-xs font-bold bg-[#1B6B3A] text-white px-4 py-1.5 rounded-lg hover:bg-emerald-950 transition">\n                  Save Text\n                </button>',
    ''
)
content_tab = content_tab.replace(
    '<button onClick={saveHomeText} className="text-xs font-bold bg-[#1B6B3A] text-white px-4 py-1.5 rounded-lg hover:bg-emerald-950 transition">\n                Save Text\n              </button>',
    ''
)
content_tab = content_tab.replace(
    '<button onClick={saveSiteImagesHandler} className="text-xs font-bold bg-[#1B6B3A] text-white px-4 py-1.5 rounded-lg hover:bg-emerald-950 transition">\n                Save Images\n              </button>',
    ''
)
content_tab = content_tab.replace(
    '<button onClick={saveCategoryMetaHandler} className="text-xs font-bold bg-[#1B6B3A] text-white px-4 py-1.5 rounded-lg hover:bg-emerald-950 transition">\n                Save Categories\n              </button>',
    ''
)
content_tab = content_tab.replace(
    '<button onClick={handleSaveBanners} className="bg-[#1B6B3A] text-white text-xs font-bold px-4 py-1.5 rounded-lg">Save Banners</button>',
    ''
)

# 4. Remove global reset buttons
content_tab = content_tab.replace(
    '<button onClick={() => resetHomeFields([\'card1_badge\', \'card1_title1\', \'card1_title2\', \'card1_p1\', \'card1_p2\', \'card1_panel_title\', \'card2_badge\', \'card2_title1\', \'card2_title2\', \'card2_intro\'])} className="text-xs font-bold text-rose-500 hover:text-rose-700 border border-rose-200 rounded-lg px-3 py-1.5">Reset all</button>',
    ''
)
content_tab = content_tab.replace(
    '<button onClick={() => resetHomeFields([...[1, 2, 3, 4, 5, 6].flatMap((i) => [`adv${i}_n`, `adv${i}_l`]), ...[1, 2, 3, 4].flatMap((i) => [`trust${i}_t`, `trust${i}_d`])])} className="text-xs font-bold text-rose-500 hover:text-rose-700 border border-rose-200 rounded-lg px-3 py-1.5">Reset all</button>',
    ''
)
content_tab = content_tab.replace(
    '<button onClick={() => resetHomeFields([\'trust_badge\', \'trust_title1\', \'trust_title2\', \'trust_sub\', \'statbar_title\', ...[1, 2, 3, 4, 5, 6].flatMap((i) => [`trustpt${i}_t`, `trustpt${i}_d`]), ...[1, 2, 3, 4].flatMap((i) => [`statbar${i}_n`, `statbar${i}_l`])])} className="text-xs font-bold text-rose-500 hover:text-rose-700 border border-rose-200 rounded-lg px-3 py-1.5">Reset all</button>',
    ''
)

# 5. Extract blocks securely using div matching
def find_div_bounds(text, search_text):
    text_pos = text.find(search_text)
    if text_pos == -1: return -1, -1
    div_start_text = '<div className="bg-white border border-slate-200 rounded-xl p-5">'
    start_pos = text.rfind(div_start_text, 0, text_pos)
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
        # We need to capture the preceding comment too if it exists.
        block_str = content_tab[start:end]
        
        # Check if there's a comment right before
        preceding = content_tab[:start]
        if preceding.rstrip().endswith("*/}"):
            comment_start = preceding.rfind("{/*")
            if comment_start != -1:
                start = comment_start
                block_str = content_tab[start:end]

        extracted_blocks[name] = block_str
        # Replace the block with an empty string
        content_tab = content_tab[:start] + content_tab[end:]
        # wait, we must recompute bounds because we changed string length!
        # better to do it iteratively by searching again
        pass

# The iterative approach
for name, marker in sections:
    start, end = find_div_bounds(content_tab, marker)
    if start != -1:
        preceding = content_tab[:start]
        if preceding.rstrip().endswith("*/}"):
            comment_start = preceding.rfind("{/*")
            if comment_start != -1:
                start = comment_start
        
        block_str = content_tab[start:end]
        if name != "Homepage Section Overrides":
            block_str = "{activeOverrideSection === '" + name + "' && (\n" + block_str + "\n)}\n"
        extracted_blocks[name] = block_str
        content_tab = content_tab[:start] + content_tab[end:]


# Reconstruct Content Tab
# We inject ALL blocks right at the top of the content tab:
# `<div className="space-y-6">`
inject_pos = content_tab.find('<div className="space-y-6">') + len('<div className="space-y-6">')

payload = "\n" + extracted_blocks.get("Homepage Section Overrides", "")
for name, _ in sections:
    if name != "Homepage Section Overrides":
        payload += extracted_blocks.get(name, "")

content_tab = content_tab[:inject_pos] + payload + content_tab[inject_pos:]

# Combine with main content
final_content = content[:start_content] + content_tab + content[end_content:]

with open(r'd:\Igo-websites\Igo-AgriMart\src\components\AdminComponent.tsx', 'w', encoding='utf-8') as f:
    f.write(final_content)

print("Done with script final")
