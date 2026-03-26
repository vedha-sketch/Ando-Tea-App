import os
from PIL import Image

def strip_checkerboard(img):
    img = img.convert("RGBA")
    data = img.getdata()
    width, height = img.size
    
    # Analyze a strip of the top left corner to find the checkerboard colors
    bg_colors = []
    for y in range(20):
        for x in range(20):
            pixel = img.getpixel((x, y))
            # Only consider if it's grayscale-ish or near white
            if abs(pixel[0]-pixel[1]) < 10 and abs(pixel[1]-pixel[2]) < 10 and pixel[0] > 180:
                bg_colors.append(pixel[:3])
    
    # Find the distinct 2 colors (usually white + grey)
    unique_bg = []
    for c in bg_colors:
        if not any(abs(c[0]-u[0])<5 and abs(c[1]-u[1])<5 and abs(c[2]-u[2])<5 for u in unique_bg):
            unique_bg.append(c)
            
    # Also add pure white just in case
    unique_bg.append((255, 255, 255))
    unique_bg.append((253, 253, 253))
    
    # Process image
    new_data = []
    min_x, min_y = width, height
    max_x, max_y = 0, 0
    
    for y in range(height):
        for x in range(width):
            pixel = img.getpixel((x, y))
            r, g, b, a = pixel
            
            # Is it a background color?
            is_bg = False
            for u in unique_bg:
                if abs(r-u[0]) < 15 and abs(g-u[1]) < 15 and abs(b-u[2]) < 15:
                    is_bg = True
                    break
            
            if is_bg:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(pixel)
                
                # Update bbox
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y
                
    img.putdata(new_data)
    
    # Crop to the real bounding box containing the deer!
    if min_x <= max_x and min_y <= max_y:
        return img.crop((min_x, min_y, max_x + 1, max_y + 1))
    return img

def create_sprite():
    img1_path = "C:/Users/vedha/.gemini/antigravity/brain/4efd99dd-f349-46b2-aa86-3e6204ea7fa7/media__1774308990975.png"
    img2_path = "C:/Users/vedha/.gemini/antigravity/brain/4efd99dd-f349-46b2-aa86-3e6204ea7fa7/media__1774309009245.png"
    
    img1 = strip_checkerboard(Image.open(img1_path))
    img2 = strip_checkerboard(Image.open(img2_path))
    
    print(f"Img1 cropped to: {img1.size}")
    print(f"Img2 cropped to: {img2.size}")
    
    # Use max width/height to center them in uniform frames
    max_w = max(img1.width, img2.width)
    max_h = max(img1.height, img2.height)
    
    sprite = Image.new("RGBA", (max_w * 2, max_h), (0, 0, 0, 0))
    
    # Bottom align
    y1 = max_h - img1.height
    x1 = (max_w - img1.width) // 2
    sprite.paste(img1, (x1, y1), img1)
    
    y2 = max_h - img2.height
    x2 = (max_w - img2.width) // 2
    sprite.paste(img2, (max_w + x2, y2), img2)
    
    sprite.save("C:/Users/vedha/.gemini/antigravity/scratch/deer-sprite2.png")
    print(f"Sprite created successfully! Frames are {max_w}x{max_h}")

if __name__ == "__main__":
    create_sprite()
