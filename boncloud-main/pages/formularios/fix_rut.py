import re

path = "/home/bon/boncloud/pages/formularios/form-001-rut.html"

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove all duplicate "4. Número de formulario" lines with their "Página X de 7" siblings
# Pattern: the 3 lines after </div> of big-num that are orphaned
# Each sheet has:
#   </div>  (closing hdr-dian)
#     <div ...>4. Número de formulario ...</div>
#     <div ...>Página X de 7</div>
#   </div>  (extra closing div)

# Remove duplicate formulario + pagina lines
content = re.sub(
    r'(\s*<div class="big-num">.*?</div>\s*</div>)\s*'
    r'<div style="flex: 1; display:flex; align-items:center;">4\. Número de formulario.*?</div>\s*'
    r'<div style="flex: 1; text-align:right;">Página \d+ de 7</div>\s*'
    r'</div>',
    r'\1',
    content,
    flags=re.DOTALL
)

# 2. Fix the absolute-positioned "2. Concepto" box - make it a normal flow element
content = content.replace(
    '<div style="position: absolute; top: 105px; left: 10px; width: 60px; border: 1px solid #000; font-size: 6px; padding: 2px; background: white;">\n    2. Concepto\n    <input type="text" style="width: 100%; border:none; outline:none; font-size:8px;">\n  </div>',
    ''
)

# 3. Add "2. Concepto" as a proper row after the NIT/DV row in sheet1
# Find the first ident-row closing and add concepto after it
old_ident = '''  </div>

  
  <div class="section-title">IDENTIFICACIÓN</div>'''

new_ident = '''  </div>

  <div class="row" style="margin-bottom: 5px;">
    <div class="cell" style="width: 80px;"><span class="cell-num">2</span><span class="cell-label">Concepto</span><input type="text" style="text-align:center;"></div>
    <div class="cell flex-1" style="font-size: 7px; justify-content: center; align-items: flex-start; padding: 4px; color: #555; line-height: 1.3;">
      1-Inscripción &nbsp; 2-Actualización &nbsp; 3-Suspensión &nbsp; 4-Cancelación
    </div>
  </div>

  <div class="section-title">IDENTIFICACIÓN</div>'''

# Only replace the first occurrence (sheet1)
content = content.replace(old_ident, new_ident, 1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("RUT form fixed successfully!")
print(f"File size: {len(content)} bytes")
