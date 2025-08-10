#!/usr/bin/env python3
"""
Batch face-swap script for FunnyCal templates.

This script takes a source image and swaps the face onto all template images
in a specified template folder, outputting the results to the output directory.

Usage:
    python batch_face_swap.py --source uploads/user_photo.jpg --template swimsuit

Requirements:
    pip install insightface opencv-python
"""

import argparse
import os
import sys
from pathlib import Path
import json

import cv2
import numpy as np
from insightface.app import FaceAnalysis
from insightface.model_zoo import get_model


def load_models(ctx_id: int, det_size: int):
    """Initialize the InsightFace analysis pipeline and the InSwapper model."""
    try:
        # Face detection / recognition pipeline
        app = FaceAnalysis(name="buffalo_l", providers=["CUDAExecutionProvider", "CPUExecutionProvider"])
        app.prepare(ctx_id=ctx_id, det_size=(det_size, det_size))

        # Face swapper model
        inswapper = get_model("inswapper_128.onnx", download=False, providers=["CUDAExecutionProvider", "CPUExecutionProvider"], ctx_id=ctx_id)
        return app, inswapper
    except Exception as e:
        print(f"Error loading models: {e}")
        sys.exit(1)


def read_image(path: str) -> np.ndarray:
    """Read and return an image from the given path."""
    img = cv2.imread(path)
    if img is None:
        raise FileNotFoundError(f"Could not read image: {path}")
    return img


def add_padding_border(image: np.ndarray, pad_ratio: float = 0.15, border_type: int = cv2.BORDER_REPLICATE):
    """Add a border around the image to make faces relatively smaller for detection.

    Returns (padded_image, pads) where pads = (top, bottom, left, right).
    """
    h, w = image.shape[:2]
    pad_x = max(1, int(w * pad_ratio))
    pad_y = max(1, int(h * pad_ratio))
    padded = cv2.copyMakeBorder(image, pad_y, pad_y, pad_x, pad_x, border_type)
    return padded, (pad_y, pad_y, pad_x, pad_x)


def detect_faces_with_border_retries(app: FaceAnalysis, image: np.ndarray, retry_pad_ratios = (0.15, 0.3)):
    """Try detecting faces on the original image; if none, retry with padded borders.

    Returns a tuple: (faces, context)
    - faces: list from app.get(...)
    - context: {
        'used_padding': bool,
        'padded_image': np.ndarray | None,
        'pads': (top, bottom, left, right) | None
      }
    """
    faces = app.get(image)
    if faces:
        return faces, { 'used_padding': False, 'padded_image': None, 'pads': None }

    for ratio in retry_pad_ratios:
        padded, pads = add_padding_border(image, ratio)
        faces = app.get(padded)
        if faces:
            return faces, { 'used_padding': True, 'padded_image': padded, 'pads': pads }

    return [], { 'used_padding': False, 'padded_image': None, 'pads': None }


def add_watermark(image: np.ndarray, watermark_text: str = "FunnyCal - Preview") -> np.ndarray:
    """Add a repeating slanted watermark across the entire image."""
    watermarked = image.copy()
    height, width = watermarked.shape[:2]
    
    # Create overlay for watermarks
    overlay = np.zeros((height, width, 3), dtype=np.uint8)
    
    # Configure watermark properties
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = max(0.8, min(width, height) / 1000)  # Scale based on image size
    thickness = max(2, int(font_scale * 2))
    
    # Get text size
    (text_width, text_height), baseline = cv2.getTextSize(watermark_text, font, font_scale, thickness)
    
    # Calculate spacing for repeating watermarks
    diagonal_spacing = int(max(text_width, text_height) * 2.5)
    
    # Angle for slanted text (45 degrees)
    angle = -45
    
    # Create rotation matrix
    center = (text_width // 2, text_height // 2)
    rotation_matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
    
    # Calculate bounds for rotated text
    cos_angle = abs(rotation_matrix[0, 0])
    sin_angle = abs(rotation_matrix[0, 1])
    rotated_width = int((text_height * sin_angle) + (text_width * cos_angle))
    rotated_height = int((text_height * cos_angle) + (text_width * sin_angle))
    
    # Adjust spacing based on rotated dimensions
    spacing_x = rotated_width + 50
    spacing_y = rotated_height + 50
    
    # Generate grid of watermark positions
    for y in range(-spacing_y, height + spacing_y, spacing_y):
        for x in range(-spacing_x, width + spacing_x, spacing_x):
            # Offset alternate rows for better coverage
            offset_x = (spacing_x // 2) if (y // spacing_y) % 2 == 1 else 0
            pos_x = x + offset_x
            pos_y = y
            
            # Check if position is within or near image bounds
            if pos_x > -rotated_width and pos_x < width + rotated_width and pos_y > -rotated_height and pos_y < height + rotated_height:
                # Create temporary image for this watermark
                temp_img = np.zeros((rotated_height + 20, rotated_width + 20, 3), dtype=np.uint8)
                
                # Add text to temporary image
                text_x = 10
                text_y = rotated_height - 10
                cv2.putText(temp_img, watermark_text, (text_x, text_y), font, font_scale, (255, 255, 255), thickness, cv2.LINE_AA)
                
                # Rotate the temporary image
                rotation_matrix = cv2.getRotationMatrix2D((temp_img.shape[1]//2, temp_img.shape[0]//2), angle, 1.0)
                rotated_text = cv2.warpAffine(temp_img, rotation_matrix, (temp_img.shape[1], temp_img.shape[0]))
                
                # Calculate position to place rotated text on overlay
                start_y = max(0, pos_y)
                end_y = min(height, pos_y + rotated_text.shape[0])
                start_x = max(0, pos_x)
                end_x = min(width, pos_x + rotated_text.shape[1])
                
                # Calculate corresponding region in rotated text
                text_start_y = max(0, -pos_y)
                text_end_y = text_start_y + (end_y - start_y)
                text_start_x = max(0, -pos_x)
                text_end_x = text_start_x + (end_x - start_x)
                
                # Only proceed if we have valid regions
                if start_y < end_y and start_x < end_x and text_start_y < text_end_y and text_start_x < text_end_x:
                    # Extract the region from rotated text
                    text_region = rotated_text[text_start_y:text_end_y, text_start_x:text_end_x]
                    
                    # Add to overlay where text exists (white pixels)
                    mask = cv2.cvtColor(text_region, cv2.COLOR_BGR2GRAY) > 0
                    overlay[start_y:end_y, start_x:end_x][mask] = [255, 255, 255]
    
    # Blend overlay with original image at 30% opacity
    alpha = 0.3
    cv2.addWeighted(overlay, alpha, watermarked, 1 - alpha, 0, watermarked)
    
    return watermarked


def process_face_swap(source_path: str, template_folder: str, output_folder: str, det_size: int = 640, ctx_id: int = -1):
    """
    Process face swap for all images in a template folder.
    
    Args:
        source_path: Path to the source image (user's photo)
        template_folder: Name of the template folder (e.g., 'swimsuit', 'superhero')
        output_folder: Path to output directory
        det_size: Detection size for face detection
        ctx_id: GPU device index (-1 for CPU)
    
    Returns:
        List of output file paths or error message
    """
    
    # Setup paths
    script_dir = Path(__file__).parent
    template_dir = script_dir / "template-images" / template_folder
    output_dir = Path(output_folder)
    watermarked_dir = output_dir / "watermarked"
    
    # Create output directories
    output_dir.mkdir(parents=True, exist_ok=True)
    watermarked_dir.mkdir(parents=True, exist_ok=True)
    
    # Check if template directory exists
    if not template_dir.exists():
        return {"success": False, "error": f"Template folder '{template_folder}' does not exist"}
    
    # Check if source image exists
    if not Path(source_path).exists():
        return {"success": False, "error": f"Source image '{source_path}' does not exist"}
    
    try:
        # Load models
        app, swapper = load_models(ctx_id=ctx_id, det_size=det_size)
        
        # Load and process source image with retries
        src_img = read_image(source_path)
        src_faces, src_ctx = detect_faces_with_border_retries(app, src_img, retry_pad_ratios=(0.12, 0.25))
        
        if not src_faces:
            # Return structured failure for source face
            report = {
                "success": False,
                "error": "No face detected in the source image. Please upload a clear photo with a visible face.",
                "failures": [{
                    "file": "source",
                    "reason": "no_face_detected",
                    "message": "No face detected in your face photo. Please upload a clear, forward-facing face photo."
                }]
            }
            try:
                report_path = Path(output_folder) / "report.json"
                with open(report_path, 'w', encoding='utf-8') as f:
                    json.dump(report, f, ensure_ascii=False, indent=2)
            except Exception as e:
                print(f"Warning: could not write report.json for source failure: {e}")
            return report
        
        # Choose the largest face as source
        src_face = max(src_faces, key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1]))
        
        # Process all template images
        output_files = []
        watermarked_files = []
        failures = []  # collect files that failed with reason
        template_files = list(template_dir.glob("*.png")) + list(template_dir.glob("*.jpg")) + list(template_dir.glob("*.jpeg"))
        
        if not template_files:
            return {"success": False, "error": f"No template images found in '{template_folder}' folder"}
        
        for template_file in sorted(template_files):
            try:
                # Load template image
                tgt_img = read_image(str(template_file))

                # Detect faces with retries (including padding)
                tgt_faces, tgt_ctx = detect_faces_with_border_retries(app, tgt_img, retry_pad_ratios=(0.12, 0.25))
                
                if not tgt_faces:
                    print(f"Warning: No faces detected in template {template_file.name}, skipping...")
                    failures.append({
                        "file": template_file.name,
                        "reason": "no_face_detected",
                        "message": "No face detected in this scene. Please choose a different picture with a clear, forward-facing face.",
                    })
                    continue
                
                # Swap depending on whether detection required padding
                if not tgt_ctx['used_padding']:
                    result_img = tgt_img.copy()
                    for face in tgt_faces:
                        result_img = swapper.get(result_img, face, src_face, paste_back=True)
                else:
                    # Perform swap on the padded image and crop back
                    padded_img = tgt_ctx['padded_image']
                    pads = tgt_ctx['pads']  # (top, bottom, left, right)
                    pad_top, pad_bottom, pad_left, pad_right = pads
                    h, w = tgt_img.shape[:2]

                    result_padded = padded_img.copy()
                    for face in tgt_faces:
                        result_padded = swapper.get(result_padded, face, src_face, paste_back=True)
                    # Crop back to original image region
                    y1, y2 = pad_top, pad_top + h
                    x1, x2 = pad_left, pad_left + w
                    result_img = result_padded[y1:y2, x1:x2]
                
                # Save clean version (for potential purchase)
                output_filename = f"swapped_{template_file.name}"
                output_path = output_dir / output_filename
                
                success = cv2.imwrite(str(output_path), result_img)
                if success:
                    output_files.append(str(output_path))
                    
                    # Create watermarked version for display
                    watermarked_img = add_watermark(result_img)
                    watermarked_path = watermarked_dir / output_filename
                    
                    watermark_success = cv2.imwrite(str(watermarked_path), watermarked_img)
                    if watermark_success:
                        watermarked_files.append(str(watermarked_path))
                        print(f"Successfully processed: {template_file.name} -> {output_filename} (clean + watermarked)")
                    else:
                        print(f"Failed to save watermarked version: {output_filename}")
                else:
                    print(f"Failed to save clean version: {output_filename}")
                    
            except Exception as e:
                print(f"Error processing template {template_file.name}: {e}")
                failures.append({
                    "file": template_file.name,
                    "reason": "processing_error",
                    "message": f"Failed to process this scene: {str(e)}",
                })
                continue
        
        # Write a detailed JSON report regardless of success/failure counts
        try:
            report = {
                "success": len(output_files) > 0,
                "total_processed": len(output_files),
                "total_failed": len(failures),
                "processed_files": [Path(p).name for p in output_files],
                "watermarked_files": [Path(p).name for p in watermarked_files],
                "failures": failures,
                "template_folder": template_folder,
            }
            report_path = output_dir / "report.json"
            with open(report_path, 'w', encoding='utf-8') as f:
                json.dump(report, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Warning: could not write report.json: {e}")

        if not output_files:
            return {"success": False, "error": "No template images could be processed successfully", "failures": failures}
        
        return {
            "success": True, 
            "output_files": output_files,
            "watermarked_files": watermarked_files,
            "total_processed": len(output_files),
            "template_folder": template_folder,
            "failures": failures
        }
        
    except Exception as e:
        return {"success": False, "error": f"Face swap processing failed: {str(e)}"}


def main():
    """Main function for command line usage."""
    parser = argparse.ArgumentParser(description="Batch face swap for template images")
    parser.add_argument("--source", required=True, help="Path to source image (user's photo)")
    parser.add_argument("--template", required=True, help="Template folder name (e.g., swimsuit, superhero)")
    parser.add_argument("--output", default="output", help="Output directory (default: output)")
    parser.add_argument("--det-size", default=640, type=int, help="Detection size (default: 640)")
    parser.add_argument("--gpu", type=int, default=-1, help="GPU device index (-1 for CPU)")
    
    args = parser.parse_args()
    
    result = process_face_swap(
        source_path=args.source,
        template_folder=args.template,
        output_folder=args.output,
        det_size=args.det_size,
        ctx_id=args.gpu
    )
    
    if result["success"]:
        print(f"\nSuccess! Processed {result['total_processed']} images.")
        print(f"Output files saved to: {args.output}")
        for file_path in result["output_files"]:
            print(f"  - {file_path}")
    else:
        print(f"\nError: {result['error']}")
        sys.exit(1)


if __name__ == "__main__":
    main()