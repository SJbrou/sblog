---
layout: post
author: Stan Brouwer
title: HEIC to JPG while keeping metadata
permalink: /projects/:year/:month/:day/:title
categories: "projects"  # Filter posts by "projects"
published: true
---

<link rel="stylesheet" href="/assets/css/prism.css">
<script src="/assets/js/prism.js"></script>


Using python to export apple HEIC images to jpg with their original "created" date  
<!-- excerpt -->

Relatives asked me to help with their photo backups.  
Their iPhone photos were in .HEIC format, which they couldn't view. Exporting to jpg from the photos app overwrote the "Created" date and thus broke their sorting. (Maybe sort on "*Content Created*" date?).

After trying everything, they decided to ask the *"computer"* guy for help (me).

Luckily, photos have metadata, which we can manipulate in Python.


```python

import os
from datetime import datetime
from PIL import Image
import pillow_heif
import piexif
from PIL import ExifTags

pillow_heif.register_heif_opener()

# Input and output directories
from_directory = "from"
to_directory = "to"

# Ensure they exists
os.makedirs(to_directory, exist_ok=True)

# Function extract EXIF DateTime or ContentCreated
def extract_datetime_or_created(exif_data):
    if exif_data:
        for tag_id, value in exif_data.items():
            tag_name = ExifTags.TAGS.get(tag_id, tag_id)
            if tag_name == 'DateTime':
                return value
            if tag_name == 'ContentCreated':
                return value
    return None

# Process all HEIC files in "from""
for filename in os.listdir(from_directory):
    if filename.lower().endswith(".heic"):
        heic_file_path = os.path.join(from_directory, filename)
        
        try:
            img = Image.open(heic_file_path)
            exif_data = img.getexif() # Extract EXIF, use DateTime/ContentCreated
            content_created_str = extract_datetime_or_created(exif_data)
            jpeg_file_path = os.path.join(to_directory, f"{os.path.splitext(filename)[0]}.jpg") # Convert to JPEG
            img = img.convert("RGB")

            if content_created_str:
                try:
                    content_created_datetime = datetime.strptime(content_created_str, "%Y:%m:%d %H:%M:%S")
                    exif_timestamp = content_created_datetime.strftime("%Y:%m:%d %H:%M:%S")
                except ValueError:
                    exif_timestamp = content_created_str
            else:
                exif_timestamp = None

            # If valid ContentCreated/DateTime, overwrite EXIF
            exif_dict = piexif.load(img.info.get("exif", b""))
            if exif_timestamp:
                # Set DateTime (EXIF tag 0x9003 (DateTimeOriginal))
                exif_dict['0th'][piexif.ImageIFD.DateTime] = exif_timestamp
                exif_dict['Exif'][piexif.ExifIFD.DateTimeOriginal] = exif_timestamp  # Set DateTimeOriginal tag

            # Convert EXIF dict to bytes
            exif_bytes = piexif.dump(exif_dict)

            # Save as JPEG
            img.save(jpeg_file_path, "JPEG", exif=exif_bytes, quality=100, optimize=True)

            print(f"Converted: {filename} to {jpeg_file_path} (ContentCreated: {exif_timestamp})")

            
            if content_created_str:
                file_timestamp = content_created_datetime.timestamp()

                # Edit os creation and modification times
                os.utime(jpeg_file_path, (file_timestamp, file_timestamp))
                print(f"Updated timestamps for {jpeg_file_path} (Created/Modified: {exif_timestamp})")

        except Exception as e:
            print(f"Failed to process {filename}: {e}")


"""

# Some code to inspect the metadata of HEIC files
from PIL import Image
import pillow_heif
from PIL import ExifTags

# Register HEIC support in Pillow
pillow_heif.register_heif_opener()

# Open the HEIC image file
heic_file_path = "path/file.HEIC"
img = Image.open(heic_file_path)

# Show the image using the default viewer (Preview on macOS)
img.show()

# Extract EXIF data
exif_data = img.getexif()

if exif_data:
    print("\nEXIF Data:")
    for tag_id, value in exif_data.items():
        tag_name = ExifTags.TAGS.get(tag_id, tag_id)  # Get the tag name from the ExifTags dictionary
        print(f"{tag_name}: {value}")
else:
    print("No EXIF data found.")
"""

```

Luckily, this worked and I could export all HEIC photo's to JPG with both the "created", "modified" and "date created" tag set to the origional "date created" tag. 
