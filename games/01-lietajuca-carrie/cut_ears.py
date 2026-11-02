from PIL import Image, ImageDraw, ImageFilter, ImageChops
im=Image.open('carrie.png').convert('RGBA'); W,H=im.size
def poly_mask(pts, blur=0):
    m=Image.new('L',(W,H),0); ImageDraw.Draw(m).polygon(pts,fill=255)
    return m.filter(ImageFilter.GaussianBlur(blur)) if blur else m
# ear polygons (image px). cut = where ear meets head
L_cut=[(212,0),(203,38),(192,75),(186,108)]
L_poly=[(60,0)]+L_cut+[(170,122),(95,80),(60,40)]
L_ext=[(60,0),(215,0),(206,40),(200,75),(196,112),(170,124),(95,80),(60,40)]   # a bit into the head, hidden behind body
R_cut=[(268,0),(278,30),(288,62),(300,98)]
R_poly=R_cut[::-1]+[(360,104),(360,0)]
R_poly=[(268,0),(278,30),(288,62),(300,98),(360,108),(360,0)]
R_ext=[(258,0),(268,30),(280,64),(294,104),(360,110),(360,0)]
a=im.split()[3]
def piece(poly):
    m=ImageChops.multiply(poly_mask(poly),a); p=im.copy(); p.putalpha(m); return p
earL=piece(L_ext); earR=piece(R_ext)
body=im.copy(); keep=ImageChops.multiply(a, ImageChops.invert(ImageChops.lighter(poly_mask(L_poly,1),poly_mask(R_poly,1)))); body.putalpha(keep)
for n,p in [('earL',earL),('earR',earR),('body',body)]:
    bb=p.getbbox(); print(n,bb); p.save(n+'.png')
