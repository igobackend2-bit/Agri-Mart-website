import sys

with open(r'd:\Igo-websites\Igo-AgriMart\src\components\AdminComponent.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

def find_div_bounds(content, search_text):
    text_pos = content.find(search_text)
    if text_pos == -1:
        return -1, -1
    
    # find the previous `<div className="bg-white border border-slate-200 rounded-xl p-5">`
    div_start_text = '<div className="bg-white border border-slate-200 rounded-xl p-5">'
    start_pos = content.rfind(div_start_text, 0, text_pos)
    if start_pos == -1:
        return -1, -1

    # find the matching closing div
    open_count = 0
    i = start_pos
    while i < len(content):
        if content.startswith('<div', i):
            open_count += 1
        elif content.startswith('</div', i):
            open_count -= 1
            if open_count == 0:
                end_pos = i + len('</div>')
                return start_pos, end_pos
        i += 1
    
    return -1, -1

def extract_and_remove(content, search_text):
    start, end = find_div_bounds(content, search_text)
    if start != -1:
        block = content[start:end]
        new_content = content[:start] + content[end:]
        return new_content, block
    return content, ""

# 1. Update dropdown options
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
content = content.replace(old_dropdown, new_dropdown)

# 2. Add individual buttons
content = content.replace(
    '<div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest mb-2">Card 1 — “Why farmers shop at IGO Agri Mart”</div>',
    '<div className="flex justify-between items-center mb-2"><div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest">Card 1 — “Why farmers shop at IGO Agri Mart”</div><div className="flex gap-2"><button onClick={saveHomeText} className="text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-2.5 py-1">Save</button><button onClick={() => resetHomeFields([\'card1_badge\', \'card1_title1\', \'card1_title2\', \'card1_p1\', \'card1_p2\', \'card1_panel_title\'])} className="text-[10px] font-bold text-rose-500 border border-rose-200 rounded px-2.5 py-1 hover:bg-rose-50">Delete</button></div></div>'
)
content = content.replace(
    '<div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest mb-2">Card 2 — “Why Farmers Trust IGO”</div>',
    '<div className="flex justify-between items-center mb-2"><div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest">Card 2 — “Why Farmers Trust IGO”</div><div className="flex gap-2"><button onClick={saveHomeText} className="text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-2.5 py-1">Save</button><button onClick={() => resetHomeFields([\'card2_badge\', \'card2_title1\', \'card2_title2\', \'card2_intro\'])} className="text-[10px] font-bold text-rose-500 border border-rose-200 rounded px-2.5 py-1 hover:bg-rose-50">Delete</button></div></div>'
)
content = content.replace(
    '<div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest mb-2">Card 1 — “The Agri Mart Advantage” stats</div>',
    '<div className="flex justify-between items-center mb-2"><div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest">Card 1 — “The Agri Mart Advantage” stats</div><div className="flex gap-2"><button onClick={saveHomeText} className="text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-2.5 py-1">Save</button><button onClick={() => resetHomeFields([1, 2, 3, 4, 5, 6].flatMap((i) => [`adv${i}_n`, `adv${i}_l`]))} className="text-[10px] font-bold text-rose-500 border border-rose-200 rounded px-2.5 py-1 hover:bg-rose-50">Delete</button></div></div>'
)
content = content.replace(
    '<div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest mb-2">Card 2 — “Why Farmers Trust IGO” points</div>',
    '<div className="flex justify-between items-center mb-2"><div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest">Card 2 — “Why Farmers Trust IGO” points</div><div className="flex gap-2"><button onClick={saveHomeText} className="text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-2.5 py-1">Save</button><button onClick={() => resetHomeFields([1, 2, 3, 4].flatMap((i) => [`trust${i}_t`, `trust${i}_d`]))} className="text-[10px] font-bold text-rose-500 border border-rose-200 rounded px-2.5 py-1 hover:bg-rose-50">Delete</button></div></div>'
)
content = content.replace(
    '<div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest mb-2">Section heading</div>',
    '<div className="flex justify-between items-center mb-2"><div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest">Section heading</div><div className="flex gap-2"><button onClick={saveHomeText} className="text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-2.5 py-1">Save</button><button onClick={() => resetHomeFields([\'trust_badge\', \'trust_title1\', \'trust_title2\', \'trust_sub\'])} className="text-[10px] font-bold text-rose-500 border border-rose-200 rounded px-2.5 py-1 hover:bg-rose-50">Delete</button></div></div>'
)
content = content.replace(
    '<div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest mb-2">6 feature cards</div>',
    '<div className="flex justify-between items-center mb-2"><div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest">6 feature cards</div><div className="flex gap-2"><button onClick={saveHomeText} className="text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-2.5 py-1">Save All</button><button onClick={() => resetHomeFields([1, 2, 3, 4, 5, 6].flatMap((i) => [`trustpt${i}_t`, `trustpt${i}_d`]))} className="text-[10px] font-bold text-rose-500 border border-rose-200 rounded px-2.5 py-1 hover:bg-rose-50">Delete All</button></div></div>'
)
content = content.replace(
    '<div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest mb-2">Stats bar</div>',
    '<div className="flex justify-between items-center mb-2"><div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest">Stats bar</div><div className="flex gap-2"><button onClick={saveHomeText} className="text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-2.5 py-1">Save</button><button onClick={() => resetHomeFields([\'statbar_title\', ...[1, 2, 3, 4].flatMap((i) => [`statbar${i}_n`, `statbar${i}_l`])])} className="text-[10px] font-bold text-rose-500 border border-rose-200 rounded px-2.5 py-1 hover:bg-rose-50">Delete</button></div></div>'
)
content = content.replace(
    '<label className="shrink-0 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg">\n                    Upload\n                    <input type="file" accept="image/*" className="hidden" onChange={(e) => readImageFile(e.target.files?.[0], (url) => setSiteImagesState({ ...siteImages, [slot.key]: url }))} />\n                  </label>',
    '<label className="shrink-0 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-1.5 rounded-lg">\n                    Upload\n                    <input type="file" accept="image/*" className="hidden" onChange={(e) => readImageFile(e.target.files?.[0], (url) => setSiteImagesState({ ...siteImages, [slot.key]: url }))} />\n                  </label>\n                  <button onClick={saveSiteImagesHandler} className="shrink-0 text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-3 py-1.5 ml-2">Save</button>'
)
content = content.replace(
    '                    <label className="flex items-center gap-1 text-[10px] font-bold text-slate-500 shrink-0">\n                      <input type="checkbox" checked={!!m.hidden} onChange={(e) => setCatField(c.name, \'hidden\', e.target.checked)} /> Hide\n                    </label>\n                  </div>',
    '                    <label className="flex items-center gap-1 text-[10px] font-bold text-slate-500 shrink-0">\n                      <input type="checkbox" checked={!!m.hidden} onChange={(e) => setCatField(c.name, \'hidden\', e.target.checked)} /> Hide\n                    </label>\n                    <button onClick={saveCategoryMetaHandler} className="shrink-0 text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-3 py-1.5 ml-2">Save</button>\n                  </div>'
)
content = content.replace(
    '<button onClick={() => setBanners(banners.map((x, idx) => idx === i ? { img: \'\', badge: \'\', title: \'\', sub: \'\', btn: \'Shop Now\', btnAction: \'seeds-saplings\' } : x))}\n                      className="text-[10px] text-red-500 font-bold hover:underline">Clear slot</button>',
    '<div className="flex items-center justify-between"><button onClick={() => setBanners(banners.map((x, idx) => idx === i ? { img: \'\', badge: \'\', title: \'\', sub: \'\', btn: \'Shop Now\', btnAction: \'seeds-saplings\' } : x))}\n                      className="text-[10px] text-rose-500 font-bold border border-rose-200 px-2 py-1 rounded hover:bg-rose-50">Delete</button><button onClick={handleSaveBanners} className="text-[10px] text-white bg-[#1B6B3A] hover:bg-emerald-950 font-bold px-3 py-1 rounded">Save</button></div>'
)

# 3. Remove global save buttons
content = content.replace(
    '<button onClick={saveHomeText} className="text-xs font-bold bg-[#1B6B3A] text-white px-4 py-1.5 rounded-lg hover:bg-emerald-950 transition">\n                  Save Text\n                </button>',
    ''
)
content = content.replace(
    '<button onClick={saveHomeText} className="text-xs font-bold bg-[#1B6B3A] text-white px-4 py-1.5 rounded-lg hover:bg-emerald-950 transition">\n                Save Text\n              </button>',
    ''
)
content = content.replace(
    '<button onClick={saveSiteImagesHandler} className="text-xs font-bold bg-[#1B6B3A] text-white px-4 py-1.5 rounded-lg hover:bg-emerald-950 transition">\n                Save Images\n              </button>',
    ''
)
content = content.replace(
    '<button onClick={saveCategoryMetaHandler} className="text-xs font-bold bg-[#1B6B3A] text-white px-4 py-1.5 rounded-lg hover:bg-emerald-950 transition">\n                Save Categories\n              </button>',
    ''
)
content = content.replace(
    '<button onClick={handleSaveBanners} className="bg-[#1B6B3A] text-white text-xs font-bold px-4 py-1.5 rounded-lg">Save Banners</button>',
    ''
)

# 4. Remove global reset buttons
content = content.replace(
    '<button onClick={() => resetHomeFields([\'card1_badge\', \'card1_title1\', \'card1_title2\', \'card1_p1\', \'card1_p2\', \'card1_panel_title\', \'card2_badge\', \'card2_title1\', \'card2_title2\', \'card2_intro\'])} className="text-xs font-bold text-rose-500 hover:text-rose-700 border border-rose-200 rounded-lg px-3 py-1.5">Reset all</button>',
    ''
)
content = content.replace(
    '<button onClick={() => resetHomeFields([...[1, 2, 3, 4, 5, 6].flatMap((i) => [`adv${i}_n`, `adv${i}_l`]), ...[1, 2, 3, 4].flatMap((i) => [`trust${i}_t`, `trust${i}_d`])])} className="text-xs font-bold text-rose-500 hover:text-rose-700 border border-rose-200 rounded-lg px-3 py-1.5">Reset all</button>',
    ''
)
content = content.replace(
    '<button onClick={() => resetHomeFields([\'trust_badge\', \'trust_title1\', \'trust_title2\', \'trust_sub\', \'statbar_title\', ...[1, 2, 3, 4, 5, 6].flatMap((i) => [`trustpt${i}_t`, `trustpt${i}_d`]), ...[1, 2, 3, 4].flatMap((i) => [`statbar${i}_n`, `statbar${i}_l`])])} className="text-xs font-bold text-rose-500 hover:text-rose-700 border border-rose-200 rounded-lg px-3 py-1.5">Reset all</button>',
    ''
)

# 5. Extract blocks
sections = [
    ("Upcoming Agri Events", "🗓 Upcoming Agri Events"),
    ("IGO Category Bands", "IGO Category Bands"),
    ("Value Cards", "Value Cards"),
    ("Card Stats & Trust Points", "Card Stats & Trust Points"),
    ("Trust Section & Stats Bar", "Trust Section & Stats Bar"),
    ("Image Manager", "🖼️ Image Manager"),
    ("Category Manager", "🗂️ Category Manager"),
    ("Marquee Banner Text", "Marquee Banner Text"),
    ("Homepage Hero Banners", "Homepage Hero Banners"),
    ("Site Notification Bar", "Site Notification Bar"),
    ("Homepage Section Overrides", "Homepage Section Overrides")
]

extracted_blocks = {}
for name, search_str in sections:
    content, block = extract_and_remove(content, search_str)
    # also remove any preceding comment if it exists
    # we don't care, we'll just output the blocks without comments
    if block:
        # Wrap the block in the conditional
        if name != "Homepage Section Overrides":
            block = "{activeOverrideSection === '" + name + "' && (\n" + block + "\n)}\n"
        extracted_blocks[name] = block


# 6. Reconstruct the file
# We extracted all these blocks from inside `{activeTab === 'Content' && (\n        <div className="space-y-6">`
# We need to put them back in that exact place!
# The place they were extracted from is right before:
#       {activeTab === 'Settings' && (
# But since we extracted them all, there might be empty space there.
# Let's find `      {activeTab === 'Settings' && (` and insert them before it.
settings_pos = content.find("      {activeTab === 'Settings' && (")
if settings_pos == -1:
    print("Failed to find settings pos!")
    sys.exit(1)

# Wait, `AdminComponent.tsx` has `{activeTab === 'Content' && (\n        <div className="space-y-6">`
# and ends with `        </div>\n      )}` right before Settings.
# The extracted blocks were inside that `space-y-6` div.
# If we removed them, `content` now has `        </div>\n      )}\n\n      {activeTab === 'Settings' && (`
# Let's find `        </div>\n      )}\n\n      {activeTab === 'Settings' && (` to inject our blocks right before `        </div>`
inject_pos = content.rfind("        </div>\n      )}\n\n      {activeTab === 'Settings' && (")
if inject_pos == -1:
    # try just finding `      {activeTab === 'Settings'`
    pass

# Actually, finding where to inject:
# Right after:
# <button onClick={saveHomeText} className="...">Save Text</button> (if there are any left)
# The safest way to inject is to find the exact line before `      {activeTab === 'Settings' && (`
# which is `      )}`. The line before that is `        </div>`.
inject_pos = content.rfind("        </div>\n      )}", 0, settings_pos)

# Create the new payload
payload = "\n" + extracted_blocks.get("Homepage Section Overrides", "")
for name, _ in sections:
    if name != "Homepage Section Overrides":
        payload += extracted_blocks.get(name, "")

# Remove stray comments that were left behind because they weren't part of the `div` we extracted.
content = content.replace("          {/* Upcoming Agri Events editor */}\n", "")
content = content.replace("          {/* Home Page Text — IGO category bands */}\n", "")
content = content.replace("          {/* Home Page Text — value cards */}\n", "")
content = content.replace("          {/* Home Page Text — card stats & trust points */}\n", "")
content = content.replace("          {/* Home Page Text — \"Why India's Farmers Trust IGO\" + stats bar */}\n", "")
content = content.replace("          {/* Image Manager — swap key site images by URL or /images/ path */}\n", "")
content = content.replace("          {/* Category Manager — rename categories, change their tile image, or hide them */}\n", "")

new_content = content[:inject_pos] + payload + content[inject_pos:]

with open(r'd:\Igo-websites\Igo-AgriMart\src\components\AdminComponent.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Done with script safe")
