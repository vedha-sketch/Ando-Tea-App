import os
from PIL import Image, ImageFilter

def strip_bg_and_halo(img):
    img = img.convert("RGBA")
    data = img.getdata()
    
    # Assume top left pixel is background color if it's not transparent
    bg_color = img.getpixel((0, 0))
    if bg_color[3] > 0:  # If top left is opaque
        new_data = []
        for p in data:
            # Increased tolerance from 10 to 30 to catch near-white anti-aliasing
            if abs(p[0]-bg_color[0])<30 and abs(p[1]-bg_color[1])<30 and abs(p[2]-bg_color[2])<30:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(p)
        img.putdata(new_data)
        
    # Shave off 1 pixel from the edges to completely eliminate the white halo
    # Split the image into R, G, B, A
    r, g, b, a = img.split()
    
    # Apply morphological erosion to the alpha channel
    # MinFilter(3) takes the minimum value in a 3x3 window, shrinking the opaque mask by 1 pixel
    a = a.filter(ImageFilter.MinFilter(3))
    
    # Merge the bands back together
    img = Image.merge("RGBA", (r, g, b, a))
        
    bbox = img.getbbox()
    if bbox:
        return img.crop(bbox)
    return img

def create_sprite():
    path_a = "C:/Users/vedha/.gemini/antigravity/brain/4efd99dd-f349-46b2-aa86-3e6204ea7fa7/media__1774309648466.png"
    path_b = "C:/Users/vedha/.gemini/antigravity/brain/4efd99dd-f349-46b2-aa86-3e6204ea7fa7/media__1774309648704.png"
    
    img_a = strip_bg_and_halo(Image.open(path_a))
    img_b = strip_bg_and_halo(Image.open(path_b))
    
    if img_a.height > img_b.height:
        img_standing = img_a
        img_bowing = img_b
    else:
        img_standing = img_b
        img_bowing = img_a
        
    print(f"Standing Deer cropped to: {img_standing.size}")
    print(f"Bowing Deer cropped to: {img_bowing.size}")
    
    max_w = max(img_standing.width, img_bowing.width)
    max_h = max(img_standing.height, img_bowing.height)
    
    sprite = Image.new("RGBA", (max_w * 2, max_h), (0, 0, 0, 0))
    
    y1 = max_h - img_standing.height
    x1 = (max_w - img_standing.width) // 2
    sprite.paste(img_standing, (x1, y1), img_standing)
    
    y2 = max_h - img_bowing.height
    x2 = (max_w - img_bowing.width) // 2
    sprite.paste(img_bowing, (max_w + x2, y2), img_bowing)
    
    sprite.save("C:/Users/vedha/.gemini/antigravity/scratch/deer-sprite4.png")
    print(f"Sprite created successfully! Frames are {max_w}x{max_h}")

if __name__ == "__main__":
    create_sprite()
