import sys
import os
from PIL import Image

def process():
    img_path = "C:/Users/vedha/.gemini/antigravity/scratch/deer-sprites.png"
    img = Image.open(img_path).convert("RGBA")
    
    # 1. Identify background color from top-left pixel
    bg_color = img.getpixel((0, 0))
    
    # 2. Make background transparent
    data = img.getdata()
    new_data = []
    # Using a threshold to remove noise if compression artifacts exist
    for item in data:
        # Check tolerance (10/255)
        if abs(item[0]-bg_color[0])<15 and abs(item[1]-bg_color[1])<15 and abs(item[2]-bg_color[2])<15:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    img.putdata(new_data)
    
    # 3. Split into 3
    w, h = img.size
    h_chunk = h // 3
    
    out_dir = "C:/Users/vedha/.gemini/antigravity/scratch"
    for i in range(3):
        # crop exactly the 1/3 segment
        box = (0, i * h_chunk, w, (i + 1) * h_chunk)
        chunk = img.crop(box)
        
        # 4. Remove text! The text is mostly black/dark at the top of the chunk. The deer is brown/orange.
        # Let's crop out the top 25% of each chunk to remove the "PNG 1: Original Profile" text.
        # 341 * 0.25 = 85. We can just cut the top 80 pixels safely? 
        # Better: let's just make the top 60 pixels fully transparent, or crop out the top.
        # To be safe, the deer are usually bottom-aligned. Let's crop the box tighter to the bottom.
        box2 = (0, 70, w, h_chunk)
        chunk = chunk.crop(box2)
        
        chunk.save(os.path.join(out_dir, f"deer_{i+1}.png"))
        print(f"Saved deer_{i+1}.png")

if __name__ == "__main__":
    process()
