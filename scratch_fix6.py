import sys

with open(r'd:\Igo-websites\Igo-AgriMart\src\components\AdminComponent.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace the dropdown options
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

# 2. Add individual buttons for each section
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

# 5. Wrap the sections into conditional renders!
# We find each section and wrap it. To avoid JSX parent issues, we wrap them as:
# {activeOverrideSection === 'XXX' && (<> ... </>)}
def wrap_block(text, start_str, end_str, condition):
    start = text.find(start_str)
    if start == -1: return text
    end = text.find(end_str, start)
    if end == -1: return text
    block = text[start:end]
    new_block = "{activeOverrideSection === '" + condition + "' && (<>\n" + block + "          </>)}\n"
    return text[:start] + new_block + text[end:]

content = wrap_block(content, "          {/* Upcoming Agri Events editor */}", "          {/* Home Page Text — IGO category bands */}", "Upcoming Agri Events")
content = wrap_block(content, "          {/* Home Page Text — IGO category bands */}", "          {/* Home Page Text — value cards */}", "IGO Category Bands")
content = wrap_block(content, "          {/* Home Page Text — value cards */}", "          {/* Home Page Text — card stats & trust points */}", "Value Cards")
content = wrap_block(content, "          {/* Home Page Text — card stats & trust points */}", "          {/* Home Page Text — \"Why India's Farmers Trust IGO\" + stats bar */}", "Card Stats & Trust Points")
content = wrap_block(content, "          {/* Home Page Text — \"Why India's Farmers Trust IGO\" + stats bar */}", "          {/* Image Manager — swap key site images by URL or /images/ path */}", "Trust Section & Stats Bar")
content = wrap_block(content, "          {/* Image Manager — swap key site images by URL or /images/ path */}", "          {/* Category Manager — rename categories, change their tile image, or hide them */}", "Image Manager")
content = wrap_block(content, "          {/* Category Manager — rename categories, change their tile image, or hide them */}", "          <div className=\"bg-white border border-slate-200 rounded-xl p-5\">\n            <div className=\"flex items-center justify-between mb-3\">\n              <h4 className=\"font-extrabold text-xs text-slate-700 uppercase tracking-widest\">Marquee Banner Text</h4>", "Category Manager")
content = wrap_block(content, "          <div className=\"bg-white border border-slate-200 rounded-xl p-5\">\n            <div className=\"flex items-center justify-between mb-3\">\n              <h4 className=\"font-extrabold text-xs text-slate-700 uppercase tracking-widest\">Marquee Banner Text</h4>", "          <div className=\"bg-white border border-slate-200 rounded-xl p-5\">\n            <div className=\"flex items-center justify-between mb-1\">\n              <h4 className=\"font-extrabold text-xs text-slate-700 uppercase tracking-widest\">Homepage Hero Banners</h4>", "Marquee Banner Text")
content = wrap_block(content, "          <div className=\"bg-white border border-slate-200 rounded-xl p-5\">\n            <div className=\"flex items-center justify-between mb-1\">\n              <h4 className=\"font-extrabold text-xs text-slate-700 uppercase tracking-widest\">Homepage Hero Banners</h4>", "          <div className=\"bg-white border border-slate-200 rounded-xl p-5\">\n            <h4 className=\"font-extrabold text-xs text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-1.5\">\n              Homepage Section Overrides", "Homepage Hero Banners")

notif_start = content.find("          <div className=\"bg-white border border-slate-200 rounded-xl p-5\">\n            <h4 className=\"font-extrabold text-xs text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-1.5\">\n              <Bell className=\"h-3.5 w-3.5 text-[#E8A020]\" /> Site Notification Bar")
notif_end = content.find("          </div>\n        </div>\n      )}\n\n      {activeTab === 'Settings' && (")
if notif_start != -1 and notif_end != -1:
    notif_end += 17 # include `          </div>\n`
    content = wrap_block(content, "          <div className=\"bg-white border border-slate-200 rounded-xl p-5\">\n            <h4 className=\"font-extrabold text-xs text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-1.5\">\n              <Bell className=\"h-3.5 w-3.5 text-[#E8A020]\" /> Site Notification Bar", content[notif_end:notif_end+20], "Site Notification Bar")

# 6. Reorder: move the "Homepage Section Overrides" dropdown to the very top.
# And place it OUTSIDE the conditionals. Wait, the dropdown itself shouldn't be wrapped. It isn't wrapped above.
content_start = content.find("{activeOverrideSection === 'Upcoming Agri Events' && (<>\n          {/* Upcoming Agri Events editor */}")
dropdown_start = content.find("          <div className=\"bg-white border border-slate-200 rounded-xl p-5\">\n            <h4 className=\"font-extrabold text-xs text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-1.5\">\n              Homepage Section Overrides")
notif_start = content.find("{activeOverrideSection === 'Site Notification Bar' && (<>\n          <div className=\"bg-white border border-slate-200 rounded-xl p-5\">")

if content_start != -1 and dropdown_start != -1 and notif_start != -1:
    dropdown_block = content[dropdown_start:notif_start]
    content = content[:dropdown_start] + content[notif_start:]
    content = content[:content_start] + dropdown_block + content[content_start:]

with open(r'd:\Igo-websites\Igo-AgriMart\src\components\AdminComponent.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done with script 6")
