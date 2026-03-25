"""Generate PWA icons with pure Python - improved version."""
import struct, zlib, os, math

def create_png(width, height, rgba_data):
    """Create PNG from raw RGBA bytes."""
    def chunk(ctype, data):
        c = ctype + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)
    
    sig = b'\x89PNG\r\n\x1a\n'
    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0))
    raw = b''
    for y in range(height):
        raw += b'\x00'
        start = y * width * 4
        raw += bytes(rgba_data[start:start + width * 4])
    idat = chunk(b'IDAT', zlib.compress(raw, 9))
    iend = chunk(b'IEND', b'')
    return sig + ihdr + idat + iend

def lerp(a, b, t):
    return int(a + (b - a) * t)

def generate_icon(size):
    """Generate a beautiful app icon."""
    pixels = [0] * (size * size * 4)
    margin = size * 0.06
    corner_r = size * 0.20
    
    # Precompute rounded rect mask
    mask = []
    for y in range(size):
        row = []
        for x in range(size):
            inside = True
            x1, y1 = margin, margin
            x2, y2 = size - margin - 1, size - margin - 1
            
            if x < x1 or x > x2 or y < y1 or y > y2:
                inside = False
            else:
                # Check corners
                for ccx, ccy in [(x1 + corner_r, y1 + corner_r), 
                                   (x2 - corner_r, y1 + corner_r),
                                   (x1 + corner_r, y2 - corner_r),
                                   (x2 - corner_r, y2 - corner_r)]:
                    dx = abs(x - ccx)
                    dy = abs(y - ccy)
                    if dx < corner_r and dy < corner_r:
                        if dx * dx + dy * dy > corner_r * corner_r:
                            inside = False
                        break
            # Anti-aliasing at edges
            alpha = 1.0
            if inside:
                # Check distance to nearest edge for anti-aliasing
                dist_to_edge = min(x - x1, x2 - x, y - y1, y2 - y) if (x1 <= x <= x2 and y1 <= y <= y2) else 0
                if dist_to_edge < 1.5:
                    alpha = max(0.5, dist_to_edge / 1.5)
            row.append((inside, alpha))
        mask.append(row)
    
    for y in range(size):
        for x in range(size):
            idx = (y * size + x) * 4
            inside, aa = mask[y][x]
            
            if not inside:
                pixels[idx+3] = 0
                continue
            
            # Gradient: top #667eea (102,126,234) -> bottom #764ba2 (118,75,162)
            t = (y - margin) / (size - 2 * margin)
            t = max(0, min(1, t))
            r = lerp(102, 118, t)
            g = lerp(126, 75, t)
            b = lerp(234, 162, t)
            
            # Decorative circles (subtle)
            cx1, cy1, cr1 = size * 0.75, size * 0.22, size * 0.18
            cx2, cy2, cr2 = size * 0.22, size * 0.78, size * 0.13
            dx1 = (x - cx1)**2 + (y - cy1)**2
            dx2 = (x - cx2)**2 + (y - cy2)**2
            if dx1 < cr1**2 or dx2 < cr2**2:
                r = lerp(r, 255, 0.12)
                g = lerp(g, 255, 0.12)
                b = lerp(b, 255, 0.12)
            
            # Draw "E" stylized letter (representing Events/Events)
            # Position in center
            cx, cy = size * 0.5, size * 0.42
            lw = max(2, size * 0.04)
            hw = size * 0.22
            hh = size * 0.28
            left = cx - hw * 0.5
            right = cx + hw * 0.5
            top_e = cy - hh * 0.5
            mid_e = cy
            bot_e = cy + hh * 0.5
            
            on_shape = False
            # Vertical bar
            if abs(x - left) <= lw and top_e - lw <= y <= bot_e + lw:
                on_shape = True
            # Top horizontal
            if abs(y - top_e) <= lw and left <= x <= right:
                on_shape = True
            # Middle horizontal
            if abs(y - mid_e) <= lw and left <= x <= right:
                on_shape = True
            # Bottom horizontal
            if abs(y - bot_e) <= lw and left <= x <= right:
                on_shape = True
            
            if on_shape:
                pixels[idx] = 255
                pixels[idx+1] = 255
                pixels[idx+2] = 255
                pixels[idx+3] = int(255 * aa)
            else:
                pixels[idx] = r
                pixels[idx+1] = g
                pixels[idx+2] = b
                pixels[idx+3] = int(255 * aa)
    
    return pixels

os.makedirs('D:/EventRecruitApp/frontend/icons', exist_ok=True)

print("Generating 192x192...")
px = generate_icon(192)
data = create_png(192, 192, px)
with open('D:/EventRecruitApp/frontend/icons/icon-192.png', 'wb') as f:
    f.write(data)
print(f"  icon-192.png: {len(data)} bytes")

print("Generating 512x512...")
px = generate_icon(512)
data = create_png(512, 512, px)
with open('D:/EventRecruitApp/frontend/icons/icon-512.png', 'wb') as f:
    f.write(data)
print(f"  icon-512.png: {len(data)} bytes")

print("Done!")
