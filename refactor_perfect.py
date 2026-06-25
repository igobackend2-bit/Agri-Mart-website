import sys

with open(r'd:\Igo-websites\Igo-AgriMart\src\components\AdminComponent.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_content = content.find("{activeTab === 'Content' && (")
end_content = content.find("{activeTab === 'Settings' && (")

if start_content == -1 or end_content == -1:
    sys.exit("Content tab bounds not found")

content_tab = content[start_content:end_content]

sections = [
    ("Upcoming Agri Events", "{/* Upcoming Agri Events editor */}"),
    ("IGO Category Bands", "{/* Home Page Text — IGO category bands */}"),
    ("Value Cards", "{/* Home Page Text — value cards */}"),
    ("Card Stats & Trust Points", "{/* Home Page Text — card stats & trust points */}"),
    ("Trust Section & Stats Bar", "{/* Home Page Text — \"Why India's Farmers Trust IGO\" + stats bar */}"),
    ("Image Manager", "🖼️ Image Manager"),
    ("Category Manager", "🗂️ Category Manager"),
    ("Marquee Banner Text", "Marquee Banner Text"),
    ("Homepage Hero Banners", "Homepage Hero Banners"),
    ("Site Notification Bar", "Site Notification Bar"),
    ("Homepage Section Overrides", "Homepage Section Overrides")
]

def extract_block(text, search_text):
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
    start, end = extract_block(content_tab, marker)
    if start != -1:
        preceding = content_tab[:start]
        if preceding.rstrip().endswith("*/}"):
            comment_start = preceding.rfind("{/*")
            if comment_start != -1:
                start = comment_start
        
        block_str = content_tab[start:end]
        if name != "Homepage Section Overrides":
            block_str = "\n{activeOverrideSection === '" + name + "' && (\n" + block_str + "\n)}\n"
        
        extracted_blocks[name] = block_str
        content_tab = content_tab[:start] + content_tab[end:]


dropdown_block = extracted_blocks.get("Homepage Section Overrides", "")

dropdown_block = dropdown_block.replace(
    """<option value="">-- Choose a section --</option>
                  {['Best Selling', "Freshly Arrived", 'Combo Kits & Deals', 'Shop By Crop', 'Seeds', 'Organic & Bio Inputs', 'Urban & Balcony Gardening', 'Animal Husbandry Essentials', 'Precision Tools & Equipments', 'Trending Products', 'Popular Agri Brands', 'Brands', 'AgriMart Farmer Updates'].map(sec => (
                    <option key={sec} value={sec}>{sec} ({homeOverrides[sec]?.length || 0} items)</option>
                  ))}""",
    """<option value="">-- Choose a section --</option>
                  <optgroup label="Content Override Forms">
                    {['Upcoming Agri Events', 'IGO Category Bands', 'Value Cards', 'Card Stats & Trust Points', 'Trust Section & Stats Bar', 'Image Manager', 'Category Manager', 'Marquee Banner Text', 'Homepage Hero Banners', 'Site Notification Bar'].map(sec => (
                       <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Product Assignments">
                    {['Best Selling', "Freshly Arrived", 'Combo Kits & Deals', 'Shop By Crop', 'Seeds', 'Organic & Bio Inputs', 'Urban & Balcony Gardening', 'Animal Husbandry Essentials', 'Precision Tools & Equipments', 'Trending Products', 'Popular Agri Brands', 'Brands', 'AgriMart Farmer Updates'].map(sec => (
                      <option key={sec} value={sec}>{sec} ({homeOverrides[sec]?.length || 0} items)</option>
                    ))}
                  </optgroup>"""
)

dropdown_block = dropdown_block.replace(
    """                  ) : (
                    <>
                      <div className="flex gap-2">
                        <input type="text" id="override-product-id" placeholder="Type product NAME or SKU to add…"
""",
    """                  ) : ['Best Selling', "Freshly Arrived", 'Seeds', 'Organic & Bio Inputs', 'Urban & Balcony Gardening', 'Animal Husbandry Essentials', 'Precision Tools & Equipments', 'Trending Products', 'AgriMart Farmer Updates'].includes(activeOverrideSection) ? (
                    <>
                      <div className="flex gap-2">
                        <input type="text" id="override-product-id" placeholder="Type product NAME or SKU to add…"
"""
)
dropdown_block = dropdown_block.replace(
    """                      </div>
                    </>
                  )}""",
    """                      </div>
                    </>
                  ) : null}"""
)

extracted_blocks["Homepage Section Overrides"] = dropdown_block


content_tab = content_tab.replace('<button onClick={saveHomeText} className="text-xs font-bold bg-[#1B6B3A] text-white px-4 py-1.5 rounded-lg hover:bg-emerald-950 transition">\n                  Save Text\n                </button>', '')
content_tab = content_tab.replace('<button onClick={saveHomeText} className="text-xs font-bold bg-[#1B6B3A] text-white px-4 py-1.5 rounded-lg hover:bg-emerald-950 transition">\n                Save Text\n              </button>', '')
content_tab = content_tab.replace('<button onClick={saveSiteImagesHandler} className="text-xs font-bold bg-[#1B6B3A] text-white px-4 py-1.5 rounded-lg hover:bg-emerald-950 transition">\n                Save Images\n              </button>', '')
content_tab = content_tab.replace('<button onClick={saveCategoryMetaHandler} className="text-xs font-bold bg-[#1B6B3A] text-white px-4 py-1.5 rounded-lg hover:bg-emerald-950 transition">\n                Save Categories\n              </button>', '')
content_tab = content_tab.replace('<button onClick={handleSaveBanners} className="bg-[#1B6B3A] text-white text-xs font-bold px-4 py-1.5 rounded-lg">Save Banners</button>', '')

content_tab = content_tab.replace('<button onClick={() => resetHomeFields([\'card1_badge\', \'card1_title1\', \'card1_title2\', \'card1_p1\', \'card1_p2\', \'card1_panel_title\', \'card2_badge\', \'card2_title1\', \'card2_title2\', \'card2_intro\'])} className="text-xs font-bold text-rose-500 hover:text-rose-700 border border-rose-200 rounded-lg px-3 py-1.5">Reset all</button>', '')
content_tab = content_tab.replace('<button onClick={() => resetHomeFields([...[1, 2, 3, 4, 5, 6].flatMap((i) => [`adv${i}_n`, `adv${i}_l`]), ...[1, 2, 3, 4].flatMap((i) => [`trust${i}_t`, `trust${i}_d`])])} className="text-xs font-bold text-rose-500 hover:text-rose-700 border border-rose-200 rounded-lg px-3 py-1.5">Reset all</button>', '')
content_tab = content_tab.replace('<button onClick={() => resetHomeFields([\'trust_badge\', \'trust_title1\', \'trust_title2\', \'trust_sub\', \'statbar_title\', ...[1, 2, 3, 4, 5, 6].flatMap((i) => [`trustpt${i}_t`, `trustpt${i}_d`]), ...[1, 2, 3, 4].flatMap((i) => [`statbar${i}_n`, `statbar${i}_l`])])} className="text-xs font-bold text-rose-500 hover:text-rose-700 border border-rose-200 rounded-lg px-3 py-1.5">Reset all</button>', '')

content_tab = content_tab.replace('<label className="flex items-center gap-1 text-[10px] font-bold text-slate-500 shrink-0">\n                      <input type="checkbox" checked={!!m.hidden} onChange={(e) => setCatField(c.name, \'hidden\', e.target.checked)} /> Hide\n                    </label>\n                  </div>', '<label className="flex items-center gap-1 text-[10px] font-bold text-slate-500 shrink-0">\n                      <input type="checkbox" checked={!!m.hidden} onChange={(e) => setCatField(c.name, \'hidden\', e.target.checked)} /> Hide\n                    </label>\n                    <button onClick={saveCategoryMetaHandler} className="shrink-0 text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-3 py-1.5 ml-2">Save</button>\n                  </div>')

# The original Image Manager block in the file (from git checkout)
# has: {(siteImages[slot.key] || '').trim() && (
# We need to insert the save button before it.
import re
content_tab = re.sub(
    r'(<input type="file" accept="image/\*" className="hidden" onChange=\{\(e\) => readImageFile\(e\.target\.files\?\.\[0\], \(url\) => setSiteImagesState\(\{ \.\.\.siteImages, \[slot\.key\]: url \}\)\)\} />\s*</label>)\s*(\{\(siteImages\[slot\.key\] \|\| \'\'\)\.trim\(\) && \()',
    r'\1\n                  <button onClick={saveSiteImagesHandler} className="shrink-0 text-[10px] font-bold text-white bg-[#1B6B3A] hover:bg-emerald-950 rounded px-3 py-1.5 ml-2">Save</button>\n                  \2',
    content_tab
)

content_tab = content_tab.replace('<button onClick={() => setBanners(banners.map((x, idx) => idx === i ? { img: \'\', badge: \'\', title: \'\', sub: \'\', btn: \'Shop Now\', btnAction: \'seeds-saplings\' } : x))}\n                      className="text-[10px] text-red-500 font-bold hover:underline">Clear slot</button>', '<div className="flex items-center justify-between"><button onClick={() => setBanners(banners.map((x, idx) => idx === i ? { img: \'\', badge: \'\', title: \'\', sub: \'\', btn: \'Shop Now\', btnAction: \'seeds-saplings\' } : x))}\n                      className="text-[10px] text-rose-500 font-bold border border-rose-200 px-2 py-1 rounded hover:bg-rose-50">Delete</button><button onClick={handleSaveBanners} className="text-[10px] text-white bg-[#1B6B3A] hover:bg-emerald-950 font-bold px-3 py-1 rounded">Save</button></div>')


def inject_text_save(block, section_key):
    return block.replace('</div>\n            </div>', f'</div>\n              <button onClick={{saveHomeText}} className="text-xs font-bold bg-[#1B6B3A] text-white px-4 py-1.5 rounded-lg hover:bg-emerald-950 mt-4">Save Text</button>\n            </div>')

inject_pos = content_tab.find('<div className="space-y-6">') + len('<div className="space-y-6">')

payload = "\n" + extracted_blocks.get("Homepage Section Overrides", "")
for name, _ in sections:
    if name != "Homepage Section Overrides":
        blk = extracted_blocks.get(name, "")
        if name in ["Upcoming Agri Events", "IGO Category Bands", "Value Cards", "Card Stats & Trust Points", "Trust Section & Stats Bar"]:
            blk = inject_text_save(blk, name)
        payload += blk

content_tab = content_tab[:inject_pos] + payload + content_tab[inject_pos:]

final_content = content[:start_content] + content_tab + content[end_content:]

with open(r'd:\Igo-websites\Igo-AgriMart\src\components\AdminComponent.tsx', 'w', encoding='utf-8') as f:
    f.write(final_content)

print("Done")
