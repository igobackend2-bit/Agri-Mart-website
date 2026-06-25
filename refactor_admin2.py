import sys
import re

with open(r'd:\Igo-websites\Igo-AgriMart\src\components\AdminComponent.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# ==========================================
# 1. Update the Select dropdown
# ==========================================
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
                    {['Upcoming Agri Events', 'IGO Category Bands', 'Value Cards', 'Trust Section & Stats Bar', 'Card Stats & Trust Points', 'Image Manager', 'Category Manager', 'Marquee Banner Text', 'Homepage Hero Banners', 'Site Notification Bar'].map(sec => (
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


# ==========================================
# 2. Extract the big content blocks
# ==========================================
# Finding start:
start_idx = content.find("          {/* Upcoming Agri Events editor */}")
# Finding end of all these blocks:
end_idx = content.find("          <div className=\"bg-white border border-slate-200 rounded-xl p-5\">\n            <h4 className=\"font-extrabold text-xs text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-1.5\">\n              Homepage Section Overrides")

if start_idx == -1 or end_idx == -1:
    print("Could not find start or end block")
    sys.exit(1)

blocks_text = content[start_idx:end_idx]

# We remove the blocks from the global flow
content = content[:start_idx] + content[end_idx:]


# ==========================================
# 3. Add the extracted blocks to the conditional
# ==========================================
# Let's split `blocks_text` into the separate sections based on their comments

sections_code = {
    'Upcoming Agri Events': "",
    'IGO Category Bands': "",
    'Value Cards': "",
    'Card Stats & Trust Points': "",
    'Trust Section & Stats Bar': "",
    'Image Manager': "",
    'Category Manager': "",
    'Marquee Banner Text': "",
    'Homepage Hero Banners': "",
    'Site Notification Bar': ""
}

# Instead of splitting by comment perfectly (which might be brittle), I will insert them as one big block of `if/else` manually by replacing string tokens in the python script.

# Actually, we can use regex to extract each block by `div.bg-white`
blocks = re.findall(r'(          {/\* .*? \*/}\n          <div className="bg-white border border-slate-200 rounded-xl p-5">.*?)(?=\n          {/\* |$)', blocks_text, flags=re.DOTALL)

# But "Site Notification Bar" is not extracted because it's part of the original blocks or below?
# Wait! "Homepage Section Overrides" is followed by "Site Notification Bar" which is also a `<div className="bg-white border border-slate-200 rounded-xl p-5">`. Let's just remove that too!

end_of_overrides = content.find("      {activeTab === 'Settings' && (")
overrides_block = content[content.find("          <div className=\"bg-white border border-slate-200 rounded-xl p-5\">\n            <h4 className=\"font-extrabold text-xs text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-1.5\">\n              Homepage Section Overrides"):end_of_overrides]

# Site Notification Bar is inside `overrides_block` at the end
# "          <div className=\"bg-white border border-slate-200 rounded-xl p-5\">\n            <h4 className=\"font-extrabold text-xs text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-1.5\">\n              <Bell className=\"h-3.5 w-3.5 text-[#E8A020]\" /> Site Notification Bar"
notif_start = overrides_block.find("          <div className=\"bg-white border border-slate-200 rounded-xl p-5\">\n            <h4 className=\"font-extrabold text-xs text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-1.5\">\n              <Bell className=\"h-3.5 w-3.5 text-[#E8A020]\" /> Site Notification Bar")
notif_block = overrides_block[notif_start:]

# Remove notif from the main content
content = content.replace(notif_block, "")

# The overrrides block now ends with: `                  )}` followed by `                </div>\n              )}\n            </div>\n          </div>\n        </div>\n`
# We want to inject the content blocks directly into the `activeOverrideSection === '...'` switch!

injection_point = "                  ) : ("
injection_idx = content.find(injection_point)

if injection_idx == -1:
    print("Could not find injection point")
    sys.exit(1)

# Now, we manually define the mappings from name to the block text
# For 'Value Cards', etc., we have to add per-item Save/Delete!

# First, extract each block from `blocks_text`
def get_block(comment_substring):
    match = re.search(r'          {/\* ' + comment_substring + r'.*?\*/}\n          <div className="bg-white border border-slate-200 rounded-xl p-5">(.*?)</div>\n(?=          {/\* |$)', blocks_text + "\n          {/* END */}", flags=re.DOTALL)
    if match:
        return match.group(1)
    return ""

def get_block_by_header(header_substring, text_src=blocks_text):
    match = re.search(r'          <div className="bg-white border border-slate-200 rounded-xl p-5">(.*?)</div>\n(?=          <div className="bg-white border border-slate-200 rounded-xl p-5">|$)', text_src + "\n          <div className=\"bg-white border border-slate-200 rounded-xl p-5\">", flags=re.DOTALL)
    
    # We need to find the specific block
    blocks_list = re.findall(r'          <div className="bg-white border border-slate-200 rounded-xl p-5">(.*?)</div>\n(?=          <div className="bg-white border border-slate-200 rounded-xl p-5">|          {/\* |$)', text_src + "\n          {/* END */}", flags=re.DOTALL)
    for b in blocks_list:
        if header_substring in b:
            return b
    return ""

# Let's write out the new code for the cases
new_cases = []

# --- 1. Upcoming Agri Events
events_code = get_block_by_header('Upcoming Agri Events', blocks_text)
new_cases.append("                  ) : activeOverrideSection === 'Upcoming Agri Events' ? (\n" + events_code)

# --- 2. IGO Category Bands
bands_code = get_block_by_header('Home Page — IGO Category Bands', blocks_text)
# We need to ensure the global save is removed and per-item is clear. It already has per-item Save/Delete. We just remove the global one.
bands_code = re.sub(r'<div className="flex items-center justify-between mb-3">.*?</div>\n            <p className="text-\[11px\] text-slate-400', '<p className="text-[11px] text-slate-400', bands_code, flags=re.DOTALL)
new_cases.append("                  ) : activeOverrideSection === 'IGO Category Bands' ? (\n" + bands_code)

# --- 3. Value Cards
value_cards_code = get_block_by_header('Home Page — Value Cards', blocks_text)
# Remove global save/reset
value_cards_code = re.sub(r'<div className="flex items-center justify-between mb-3">.*?</div>\n            <p className="text-\[11px\]', '<p className="text-[11px]', value_cards_code, flags=re.DOTALL)
# Add per-card save/reset
value_cards_code = value_cards_code.replace(
    '<div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest mb-2">Card 1 — “Why farmers shop at IGO Agri Mart”</div>',
    '<div className="flex justify-between items-center mb-2"><div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest">Card 1 — “Why farmers shop at IGO Agri Mart”</div><div className="flex gap-2"><button onClick={saveHomeText} className="text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-2.5 py-1">Save</button><button onClick={() => resetHomeFields([\'card1_badge\', \'card1_title1\', \'card1_title2\', \'card1_p1\', \'card1_p2\', \'card1_panel_title\'])} className="text-[10px] font-bold text-rose-500 border border-rose-200 rounded px-2.5 py-1 hover:bg-rose-50">Delete</button></div></div>'
)
value_cards_code = value_cards_code.replace(
    '<div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest mb-2">Card 2 — “Why Farmers Trust IGO”</div>',
    '<div className="flex justify-between items-center mb-2"><div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest">Card 2 — “Why Farmers Trust IGO”</div><div className="flex gap-2"><button onClick={saveHomeText} className="text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-2.5 py-1">Save</button><button onClick={() => resetHomeFields([\'card2_badge\', \'card2_title1\', \'card2_title2\', \'card2_intro\'])} className="text-[10px] font-bold text-rose-500 border border-rose-200 rounded px-2.5 py-1 hover:bg-rose-50">Delete</button></div></div>'
)
new_cases.append("                  ) : activeOverrideSection === 'Value Cards' ? (\n" + value_cards_code)

# --- 4. Card Stats & Trust Points
stats_pts_code = get_block_by_header('Card Stats & Trust Points', blocks_text)
stats_pts_code = re.sub(r'<div className="flex items-center justify-between mb-3">.*?</div>\n            <p className="text-\[11px\]', '<p className="text-[11px]', stats_pts_code, flags=re.DOTALL)
stats_pts_code = stats_pts_code.replace(
    '<div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest mb-2">Card 1 — “The Agri Mart Advantage” stats</div>',
    '<div className="flex justify-between items-center mb-2"><div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest">Card 1 — “The Agri Mart Advantage” stats</div><div className="flex gap-2"><button onClick={saveHomeText} className="text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-2.5 py-1">Save</button><button onClick={() => resetHomeFields([1, 2, 3, 4, 5, 6].flatMap((i) => [`adv${i}_n`, `adv${i}_l`]))} className="text-[10px] font-bold text-rose-500 border border-rose-200 rounded px-2.5 py-1 hover:bg-rose-50">Delete</button></div></div>'
)
stats_pts_code = stats_pts_code.replace(
    '<div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest mb-2">Card 2 — “Why Farmers Trust IGO” points</div>',
    '<div className="flex justify-between items-center mb-2"><div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest">Card 2 — “Why Farmers Trust IGO” points</div><div className="flex gap-2"><button onClick={saveHomeText} className="text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-2.5 py-1">Save</button><button onClick={() => resetHomeFields([1, 2, 3, 4].flatMap((i) => [`trust${i}_t`, `trust${i}_d`]))} className="text-[10px] font-bold text-rose-500 border border-rose-200 rounded px-2.5 py-1 hover:bg-rose-50">Delete</button></div></div>'
)
new_cases.append("                  ) : activeOverrideSection === 'Card Stats & Trust Points' ? (\n" + stats_pts_code)

# --- 5. Trust Section & Stats Bar
trust_code = get_block_by_header('Trust Section &amp; Stats Bar', blocks_text)
trust_code = re.sub(r'<div className="flex items-center justify-between mb-3">.*?</div>\n            <p className="text-\[11px\]', '<p className="text-[11px]', trust_code, flags=re.DOTALL)
trust_code = trust_code.replace(
    '<div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest mb-2">Section heading</div>',
    '<div className="flex justify-between items-center mb-2"><div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest">Section heading</div><div className="flex gap-2"><button onClick={saveHomeText} className="text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-2.5 py-1">Save</button><button onClick={() => resetHomeFields([\'trust_badge\', \'trust_title1\', \'trust_title2\', \'trust_sub\'])} className="text-[10px] font-bold text-rose-500 border border-rose-200 rounded px-2.5 py-1 hover:bg-rose-50">Delete</button></div></div>'
)
trust_code = trust_code.replace(
    '<div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest mb-2">6 feature cards</div>',
    '<div className="flex justify-between items-center mb-2"><div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest">6 feature cards</div><div className="flex gap-2"><button onClick={saveHomeText} className="text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-2.5 py-1">Save All</button><button onClick={() => resetHomeFields([1, 2, 3, 4, 5, 6].flatMap((i) => [`trustpt${i}_t`, `trustpt${i}_d`]))} className="text-[10px] font-bold text-rose-500 border border-rose-200 rounded px-2.5 py-1 hover:bg-rose-50">Delete All</button></div></div>'
)
trust_code = trust_code.replace(
    '<div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest mb-2">Stats bar</div>',
    '<div className="flex justify-between items-center mb-2"><div className="text-[11px] font-black text-[#1B6B3A] uppercase tracking-widest">Stats bar</div><div className="flex gap-2"><button onClick={saveHomeText} className="text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-2.5 py-1">Save</button><button onClick={() => resetHomeFields([\'statbar_title\', ...[1, 2, 3, 4].flatMap((i) => [`statbar${i}_n`, `statbar${i}_l`])])} className="text-[10px] font-bold text-rose-500 border border-rose-200 rounded px-2.5 py-1 hover:bg-rose-50">Delete</button></div></div>'
)
new_cases.append("                  ) : activeOverrideSection === 'Trust Section & Stats Bar' ? (\n" + trust_code)

# --- 6. Image Manager
image_code = get_block_by_header('Image Manager', blocks_text)
# Global save -> per image save
image_code = re.sub(r'<div className="flex items-center justify-between mb-3">.*?</div>\n            <p className="text-\[11px\]', '<p className="text-[11px]', image_code, flags=re.DOTALL)
image_code = image_code.replace(
    '<label className="shrink-0 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg">\n                    Upload\n                    <input type="file" accept="image/*" className="hidden" onChange={(e) => readImageFile(e.target.files?.[0], (url) => setSiteImagesState({ ...siteImages, [slot.key]: url }))} />\n                  </label>',
    '<label className="shrink-0 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-1.5 rounded-lg">\n                    Upload\n                    <input type="file" accept="image/*" className="hidden" onChange={(e) => readImageFile(e.target.files?.[0], (url) => setSiteImagesState({ ...siteImages, [slot.key]: url }))} />\n                  </label>\n                  <button onClick={saveSiteImagesHandler} className="shrink-0 text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-3 py-1.5 ml-2">Save</button>'
)
new_cases.append("                  ) : activeOverrideSection === 'Image Manager' ? (\n" + image_code)

# --- 7. Category Manager
cat_code = get_block_by_header('Category Manager', blocks_text)
cat_code = re.sub(r'<div className="flex items-center justify-between mb-3">.*?</div>\n            <p className="text-\[11px\]', '<p className="text-[11px]', cat_code, flags=re.DOTALL)
cat_code = cat_code.replace(
    '                    <label className="flex items-center gap-1 text-[10px] font-bold text-slate-500 shrink-0">\n                      <input type="checkbox" checked={!!m.hidden} onChange={(e) => setCatField(c.name, \'hidden\', e.target.checked)} /> Hide\n                    </label>\n                  </div>',
    '                    <label className="flex items-center gap-1 text-[10px] font-bold text-slate-500 shrink-0">\n                      <input type="checkbox" checked={!!m.hidden} onChange={(e) => setCatField(c.name, \'hidden\', e.target.checked)} /> Hide\n                    </label>\n                    <button onClick={saveCategoryMetaHandler} className="shrink-0 text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-3 py-1.5 ml-2">Save</button>\n                  </div>'
)
new_cases.append("                  ) : activeOverrideSection === 'Category Manager' ? (\n" + cat_code)

# --- 8. Marquee Banner Text
marquee_code = get_block_by_header('Marquee Banner Text', blocks_text)
marquee_code = re.sub(r'<div className="flex items-center justify-between mb-3">.*?</div>\n            <p className="text-\[11px\]', '<p className="text-[11px]', marquee_code, flags=re.DOTALL)
# It's already fine as is
new_cases.append("                  ) : activeOverrideSection === 'Marquee Banner Text' ? (\n" + marquee_code)

# --- 9. Homepage Hero Banners
banner_code = get_block_by_header('Homepage Hero Banners', blocks_text)
banner_code = re.sub(r'<div className="flex items-center justify-between mb-1">.*?</div>\n            <p className="text-\[11px\]', '<p className="text-[11px]', banner_code, flags=re.DOTALL)
banner_code = banner_code.replace(
    '<button onClick={() => setBanners(banners.map((x, idx) => idx === i ? { img: \'\', badge: \'\', title: \'\', sub: \'\', btn: \'Shop Now\', btnAction: \'seeds-saplings\' } : x))}\n                      className="text-[10px] text-red-500 font-bold hover:underline">Clear slot</button>',
    '<div className="flex items-center justify-between"><button onClick={() => setBanners(banners.map((x, idx) => idx === i ? { img: \'\', badge: \'\', title: \'\', sub: \'\', btn: \'Shop Now\', btnAction: \'seeds-saplings\' } : x))}\n                      className="text-[10px] text-rose-500 font-bold border border-rose-200 px-2 py-1 rounded hover:bg-rose-50">Delete</button><button onClick={handleSaveBanners} className="text-[10px] text-white bg-[#1B6B3A] hover:bg-emerald-950 font-bold px-3 py-1 rounded">Save</button></div>'
)
new_cases.append("                  ) : activeOverrideSection === 'Homepage Hero Banners' ? (\n" + banner_code)

# --- 10. Site Notification Bar
notif_inner = re.search(r'            <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">\n              <Bell className="h-3.5 w-3.5 text-\[#E8A020\]" /> Site Notification Bar\n            </h4>\n(.*?)</div>', notif_block, flags=re.DOTALL)
if notif_inner:
    new_cases.append("                  ) : activeOverrideSection === 'Site Notification Bar' ? (\n            <>\n" + notif_inner.group(1) + "</>\n")

# Combine all new cases and inject them!
content = content.replace("                  ) : (", "\n".join(new_cases) + "\n                  ) : (")

with open(r'd:\Igo-websites\Igo-AgriMart\src\components\AdminComponent.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement complete.")
