import re

with open(r'd:\Igo-websites\Igo-AgriMart\src\components\AdminComponent.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. First, find all the content blocks we want to move.
# They are located between:
# {/* Upcoming Agri Events editor */}
# and 
# {/* Homepage Section Overrides */} 
# wait, there's no comment for the overrides dropdown, it's just <div className="bg-white border border-slate-200 rounded-xl p-5">
# let's locate the exact start and end.

start_marker = "          {/* Upcoming Agri Events editor */}"
end_marker = "              Homepage Section Overrides\n            </h4>"

start_idx = content.find(start_marker)

# Find the start of the overrides block
override_block_start = content.rfind('<div className="bg-white border border-slate-200 rounded-xl p-5">', 0, content.find(end_marker))

# Extract the blocks to be moved
blocks_to_move = content[start_idx:override_block_start]

# 2. Modify the options in the dropdown
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
                    {['Upcoming Agri Events', 'IGO Category Bands', 'Value Cards', 'Trust Section & Stats Bar', 'Image Manager', 'Category Manager', 'Marquee Banner Text', 'Homepage Hero Banners', 'Site Notification Bar'].map(sec => (
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

# Remove the blocks from their original location
content = content.replace(blocks_to_move, "")

# Now we need to insert them inside the activeOverrideSection switch block.
# Let's find: `activeOverrideSection === 'Combo Kits & Deals' ? (`
# And insert our new cases before it.

# Before we insert, let's wrap the blocks with the conditional logic.
# Also, we need to strip the wrapping `<div className="bg-white border border-slate-200 rounded-xl p-5">` from each so they blend into the override panel, OR just leave them and remove the p-4 padding of the override panel?
# The override panel uses: `<div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">`
# Let's keep the inner contents.

# Wait, it's easier to just paste the blocks and use `activeOverrideSection === 'Value Cards' ? ( ... ) : ...`
# Let's manually write the replace strings for each section to add the per-card Save/Delete buttons.

print("Done part 1")
