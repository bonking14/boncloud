import os
import re

files = [
    "form-001-rut.html",
    "form-500-importacion.html",
    "form-600-exportacion.html",
    "form-dta-transito.html"
]

for f in files:
    path = os.path.join("/home/bon/boncloud/pages/formularios", f)
    if not os.path.exists(path):
        continue
        
    with open(path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Remove the nav-bar-container entirely
    content = re.sub(r'<div class="nav-bar-container">.*?</div>\s*</div>', '', content, flags=re.DOTALL)
    content = re.sub(r'<div class="nav-bar-container">.*?</div>', '', content, flags=re.DOTALL)
    
    # Update body styling for seamless iframe embedding
    content = content.replace("font-family: Arial, Helvetica, sans-serif;", "font-family: 'Inter', sans-serif;")
    content = content.replace("background-color: #f0f0f0;", "background-color: transparent;")
    
    # Make sure form-container centers nicely without top margin
    content = content.replace("padding: 20px;", "padding: 0;")
    
    # If the file had special hoja buttons in a row inside nav-bar-container (form 001), 
    # we need to keep them or move them. Actually, form 001 needs the sheet navigation buttons.
    # Let's re-inject just the Hoja navigation buttons for form 001.
    if f == "form-001-rut.html":
        # The previous step replaced the whole nav-bar. We might have lost the Hoja buttons if we stripped them.
        # Let's recreate them if they are missing.
        if "showSheet(1)" not in content:
            hoja_buttons = """
<div style="display:flex; gap:10px; margin-bottom:15px; width: 794px; justify-content: center; flex-wrap: wrap;">
  <button class="nav-btn active" onclick="showSheet(1)">Hoja 1</button>
  <button class="nav-btn" onclick="showSheet(2)">Hoja 2</button>
  <button class="nav-btn" onclick="showSheet(3)">Hoja 3</button>
  <button class="nav-btn" onclick="showSheet(4)">Hoja 4</button>
  <button class="nav-btn" onclick="showSheet(5)">Hoja 5</button>
  <button class="nav-btn" onclick="showSheet(6)">Hoja 6</button>
  <button class="nav-btn" onclick="showSheet(7)">Hoja 7</button>
</div>
"""
            # Inject before <div id="sheet1"
            content = content.replace('<div id="sheet1"', hoja_buttons + '\n<div id="sheet1"')

    with open(path, 'w', encoding='utf-8') as file:
        file.write(content)

print("Iframes fixed successfully!")
