import os
from PIL import Image

def remove_white_halo(img):
    img = img.convert("RGBA")
    width, height = img.size
    pixels = img.load()
    
    # 1. First, let's treat the solid background if it exists
    bg_color = pixels[0, 0]
    if bg_color[3] > 0 and abs(bg_color[0]-255)<10 and abs(bg_color[1]-255)<10 and abs(bg_color[2]-255)<10:
        for y in range(height):
            for x in range(width):
                p = pixels[x, y]
                if abs(p[0]-bg_color[0])<15 and abs(p[1]-bg_color[1])<15 and abs(p[2]-bg_color[2])<15:
                    pixels[x, y] = (255, 255, 255, 0)
    
    # 2. Remove white halo ONLY on edges
    # We do this by finding pixels that are very light/white and touch a transparent pixel.
    # We'll collect them in a list then modify to avoid sequence bleeding.
    to_remove = []
    
    for y in range(height):
        for x in range(width):
            p = pixels[x, y]
            # Is it near white? (anti-aliased halo usually is light, greyish/white)
            if p[3] > 0 and p[0] > 200 and p[1] > 200 and p[2] > 200:
                # Check neighbors
                is_edge = False
                for dx, dy in [(-1,0), (1,0), (0,-1), (0,1), (-1,-1), (1,-1), (-1,1), (1,1)]:
                    nx, ny = x+dx, y+dy
                    if 0 <= nx < width and 0 <= ny < height:
                        if pixels[nx, ny][3] == 0:
                            is_edge = True
                            break
                if is_edge:
                    to_remove.append((x, y))
                    
    for x, y in to_remove:
        pixels[x, y] = (255, 255, 255, 0)

    # Do a second pass for stubborn wide halos
    to_remove2 = []
    for y in range(height):
        for x in range(width):
            p = pixels[x, y]
            if p[3] > 0 and p[0] > 200 and p[1] > 200 and p[2] > 200:
                is_edge = False
                for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
                    nx, ny = x+dx, y+dy
                    if 0 <= nx < width and 0 <= ny < height:
                        if pixels[nx, ny][3] == 0:
                            is_edge = True
                            break
                if is_edge:
                    to_remove2.append((x, y))
                    
    for x, y in to_remove2:
        pixels[x, y] = (255, 255, 255, 0)
        
    bbox = img.getbbox()
    if bbox:
        return img.crop(bbox)
    return img

def create_sprite():
    path_a = "C:/Users/vedha/.gemini/antigravity/brain/4efd99dd-f349-46b2-aa86-3e6204ea7fa7/media__1774309648466.png"
    path_b = "C:/Users/vedha/.gemini/antigravity/brain/4efd99dd-f349-46b2-aa86-3e6204ea7fa7/media__1774309648704.png"
    
    img_a = remove_white_halo(Image.open(path_a))
    img_b = remove_white_halo(Image.open(path_b))
    
    if img_a.height > img_b.height:
        img_standing = img_a
        img_bowing = img_b
    else:
        img_standing = img_b
        img_bowing = img_a
        
    max_w = max(img_standing.width, img_bowing.width)
    max_h = max(img_standing.height, img_bowing.height)
    
    sprite = Image.new("RGBA", (max_w * 2, max_h), (0, 0, 0, 0))
    
    y1 = max_h - img_standing.height
    x1 = (max_w - img_standing.width) // 2
    sprite.paste(img_standing, (x1, y1), img_standing)
    
    y2 = max_h - img_bowing.height
    x2 = (max_w - img_bowing.width) // 2
    sprite.paste(img_bowing, (max_w + x2, y2), img_bowing)
    
    sprite.save("C:/Users/vedha/.gemini/antigravity/scratch/deer-sprite5.png")
    print(f"Sprite created! Frames are {max_w}x{max_h}")

if __name__ == "__main__":
    create_sprite()
