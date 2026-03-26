import os
from PIL import Image

def strip_bg(img):
    img = img.convert("RGBA")
    data = img.getdata()
    # Assume top left pixel is background color if it's not transparent
    bg_color = img.getpixel((0, 0))
    if bg_color[3] > 0:  # If top left is opaque (e.g. white)
        new_data = []
        for p in data:
            if abs(p[0]-bg_color[0])<10 and abs(p[1]-bg_color[1])<10 and abs(p[2]-bg_color[2])<10:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(p)
        img.putdata(new_data)
        
    bbox = img.getbbox()
    if bbox:
        return img.crop(bbox)
    return img

def create_sprite():
    path_a = "C:/Users/vedha/.gemini/antigravity/brain/4efd99dd-f349-46b2-aa86-3e6204ea7fa7/media__1774309648466.png"
    path_b = "C:/Users/vedha/.gemini/antigravity/brain/4efd99dd-f349-46b2-aa86-3e6204ea7fa7/media__1774309648704.png"
    
    img_a = strip_bg(Image.open(path_a))
    img_b = strip_bg(Image.open(path_b))
    
    # Standing is taller. Bowing is wider (or shorter).
    if img_a.height > img_b.height:
        img_standing = img_a
        img_bowing = img_b
    else:
        img_standing = img_b
        img_bowing = img_a
        
    print(f"Standing Deer cropped to: {img_standing.size}")
    print(f"Bowing Deer cropped to: {img_bowing.size}")
    
    # Use max width/height to center them in uniform frames
    max_w = max(img_standing.width, img_bowing.width)
    max_h = max(img_standing.height, img_bowing.height)
    
    sprite = Image.new("RGBA", (max_w * 2, max_h), (0, 0, 0, 0))
    
    # Bottom align Standing
    y1 = max_h - img_standing.height
    x1 = (max_w - img_standing.width) // 2
    sprite.paste(img_standing, (x1, y1), img_standing)
    
    # Bottom align Bowing
    y2 = max_h - img_bowing.height
    x2 = (max_w - img_bowing.width) // 2
    sprite.paste(img_bowing, (max_w + x2, y2), img_bowing)
    
    sprite.save("C:/Users/vedha/.gemini/antigravity/scratch/deer-sprite3.png")
    print(f"Sprite created successfully! Frames are {max_w}x{max_h}")

if __name__ == "__main__":
    create_sprite()
