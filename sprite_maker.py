import os
from PIL import Image

def create_sprite():
    img1_path = "C:/Users/vedha/.gemini/antigravity/brain/4efd99dd-f349-46b2-aa86-3e6204ea7fa7/media__1774308990975.png"
    img2_path = "C:/Users/vedha/.gemini/antigravity/brain/4efd99dd-f349-46b2-aa86-3e6204ea7fa7/media__1774309009245.png"
    
    img1 = Image.open(img1_path).convert("RGBA")
    img2 = Image.open(img2_path).convert("RGBA")
    
    # Crop transparent borders
    bbox1 = img1.getbbox()
    if bbox1: img1 = img1.crop(bbox1)
        
    bbox2 = img2.getbbox()
    if bbox2: img2 = img2.crop(bbox2)
        
    # Get max width and max height to create uniform frames
    max_w = max(img1.width, img2.width)
    max_h = max(img1.height, img2.height)
    
    # Create horizontal sprite sheet
    # 2 frames side by side
    sprite = Image.new("RGBA", (max_w * 2, max_h), (0, 0, 0, 0))
    
    # Paste img1 in frame 1 (bottom aligned)
    y_offset1 = max_h - img1.height
    x_offset1 = (max_w - img1.width) // 2
    sprite.paste(img1, (x_offset1, y_offset1), img1)
    
    # Paste img2 in frame 2 (bottom aligned)
    y_offset2 = max_h - img2.height
    x_offset2 = (max_w - img2.width) // 2
    sprite.paste(img2, (max_w + x_offset2, y_offset2), img2)
    
    out_path = "C:/Users/vedha/.gemini/antigravity/scratch/deer-sprite2.png"
    sprite.save(out_path)
    print(f"Sprite created successfully! Frames are {max_w}x{max_h}")

if __name__ == "__main__":
    create_sprite()
