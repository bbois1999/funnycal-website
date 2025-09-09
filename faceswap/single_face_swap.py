#!/usr/bin/env python3

import sys
import os
import cv2
import numpy as np
import json
from pathlib import Path
import insightface
from insightface.app import FaceAnalysis
from insightface.data import get_image as ins_get_image

def setup_face_analysis():
    """Initialize the face analysis model"""
    app = FaceAnalysis(name='buffalo_l')
    app.prepare(ctx_id=0, det_size=(640, 640))
    return app

def get_swapper_model():
    """Initialize the face swapper model"""
    swapper = insightface.model_zoo.get_model('inswapper_128.onnx', download=False, download_zip=False)
    return swapper

def detect_face_with_retry(app, img_path, max_retries=2):
    """
    Detect faces in an image with retry logic using border padding
    """
    img = cv2.imread(str(img_path))
    if img is None:
        return None, "Could not read image file"
    
    faces = app.get(img)
    if len(faces) > 0:
        return faces[0], None
    
    # Try with border padding for edge cases
    for border_size in [20, 50]:
        try:
            bordered_img = cv2.copyMakeBorder(
                img, border_size, border_size, border_size, border_size,
                cv2.BORDER_CONSTANT, value=[128, 128, 128]
            )
            faces = app.get(bordered_img)
            if len(faces) > 0:
                # Adjust face coordinates back to original image
                face = faces[0]
                face.bbox -= border_size
                face.kps -= border_size
                return face, None
        except Exception as e:
            continue
    
    return None, "No face detected in this image"

def add_watermark(img, product_type="shirt"):
    """Add a watermark to the image"""
    h, w = img.shape[:2]
    
    # Create watermark text based on product type
    if product_type == "shirt":
        watermark_text = "FunnyCal T-Shirt Preview"
    elif product_type == "poster":
        watermark_text = "FunnyCal Poster Preview"
    else:
        watermark_text = "FunnyCal Preview"
    
    # Calculate font scale based on image size
    font_scale = min(w, h) / 1000.0
    font_thickness = max(1, int(font_scale * 2))
    
    # Get text size
    (text_width, text_height), baseline = cv2.getTextSize(
        watermark_text, cv2.FONT_HERSHEY_SIMPLEX, font_scale, font_thickness
    )
    
    # Position watermark in bottom right
    margin = int(min(w, h) * 0.02)
    x = w - text_width - margin
    y = h - margin
    
    # Add semi-transparent background
    overlay = img.copy()
    cv2.rectangle(overlay, (x - 10, y - text_height - 10), (w, h), (0, 0, 0), -1)
    img = cv2.addWeighted(img, 0.8, overlay, 0.2, 0)
    
    # Add white text
    cv2.putText(img, watermark_text, (x, y), cv2.FONT_HERSHEY_SIMPLEX, 
                font_scale, (255, 255, 255), font_thickness, cv2.LINE_AA)
    
    return img

def perform_single_face_swap(user_img_path, template_path, output_dir, product_type):
    """
    Perform face swap for a single image (shirt/poster)
    """
    try:
        # Initialize models
        app = setup_face_analysis()
        swapper = get_swapper_model()
        
        # Detect face in user image
        user_face, user_error = detect_face_with_retry(app, user_img_path)
        if user_face is None:
            return {
                "success": False,
                "error": "No face detected in the uploaded image",
                "failures": [{
                    "file": str(user_img_path),
                    "reason": "no_face_detected",
                    "message": "No face detected in the source image. Please upload a clear photo with a visible face."
                }]
            }
        
        # Check if template exists
        if not os.path.exists(template_path):
            return {
                "success": False,
                "error": f"Template not found: {template_path}",
                "failures": [{
                    "file": str(template_path),
                    "reason": "template_not_found",
                    "message": "Template image not found on server."
                }]
            }
        
        # Load template image
        template_img = cv2.imread(str(template_path))
        if template_img is None:
            return {
                "success": False,
                "error": "Could not read template image",
                "failures": [{
                    "file": str(template_path),
                    "reason": "template_read_error",
                    "message": "Could not read template image file."
                }]
            }
        
        # Detect face in template
        template_faces = app.get(template_img)
        if len(template_faces) == 0:
            return {
                "success": False,
                "error": "No face detected in template",
                "failures": [{
                    "file": str(template_path),
                    "reason": "no_face_detected",
                    "message": "No face detected in this template image."
                }]
            }
        
        # Use the first detected face in template
        template_face = template_faces[0]
        
        # Perform face swap
        swapped_img = swapper.get(template_img, template_face, user_face, paste_back=True)
        
        # Create output filenames
        base_name = Path(template_path).stem
        output_filename = f"swapped_{base_name}.png"
        watermarked_filename = f"watermarked_{base_name}.png"
        
        output_path = Path(output_dir) / output_filename
        watermarked_path = Path(output_dir) / watermarked_filename
        
        # Save original swapped image
        cv2.imwrite(str(output_path), swapped_img)
        
        # Create and save watermarked version
        watermarked_img = add_watermark(swapped_img.copy(), product_type)
        cv2.imwrite(str(watermarked_path), watermarked_img)
        
        result = {
            "success": True,
            "output_file": str(output_path),
            "watermarked_file": str(watermarked_path),
            "failures": []
        }
        
        # Save report
        report_path = Path(output_dir) / "report.json"
        with open(report_path, 'w') as f:
            json.dump(result, f, indent=2)
        
        return result
        
    except Exception as e:
        error_msg = f"Face swap failed: {str(e)}"
        result = {
            "success": False,
            "error": error_msg,
            "failures": [{
                "file": str(user_img_path),
                "reason": "processing_error",
                "message": f"Error during face swap processing: {str(e)}"
            }]
        }
        
        # Save error report
        try:
            report_path = Path(output_dir) / "report.json"
            with open(report_path, 'w') as f:
                json.dump(result, f, indent=2)
        except:
            pass
        
        return result

def main():
    if len(sys.argv) != 5:
        print("Usage: python single_face_swap.py <user_image> <template_path> <output_dir> <product_type>")
        sys.exit(1)
    
    user_img_path = sys.argv[1]
    template_path = sys.argv[2]
    output_dir = sys.argv[3]
    product_type = sys.argv[4]
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Perform face swap
    result = perform_single_face_swap(user_img_path, template_path, output_dir, product_type)
    
    # Print result as JSON (for Node.js to parse)
    print(json.dumps(result))

if __name__ == "__main__":
    main()
