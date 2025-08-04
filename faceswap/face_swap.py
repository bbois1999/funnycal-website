#!/usr/bin/env python3
"""
Simple face-swap script using InsightFace.

(1) Installs and loads the InsightFace detection model and the InSwapper model.
(2) Detects and extracts the source face from the first image.
(3) Detects all faces in the second image and swaps them with the source face.
(4) Writes the resulting image to disk.

Example usage (PowerShell / CMD):

    python face_swap.py --source C:\faceswap\alex.png --target C:\faceswap\flyer.jpeg --output C:\faceswap\flyer_swapped.jpeg

Requirements:
    pip install insightface opencv-python

NOTE: The first time the script runs it will automatically download the required ONNX models (~100 MB) and cache them under ~/.insightface.
"""

import argparse
import os
from pathlib import Path

import cv2
import numpy as np
from insightface.app import FaceAnalysis
from insightface.model_zoo import get_model


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Swap the face from --source onto every face in --target using InsightFace.")
    parser.add_argument("--source", required=True, help="Path to the image providing the source face (e.g. alex.png)")
    parser.add_argument("--target", required=True, help="Path to the destination image whose faces will be replaced (e.g. flyer.jpeg)")
    parser.add_argument("--output", default="output.jpeg", help="Path to write the swapped image (default: output.jpeg)")
    parser.add_argument("--det-size", default=640, type=int, help="Size for the face detector's input (default: 640). Larger improves detection but is slower.")
    parser.add_argument("--gpu", type=int, default=-1, help="GPU device index to run on. Use -1 for CPU only (default).")
    return parser.parse_args()


def load_models(ctx_id: int, det_size: int):
    """Initialise the InsightFace analysis pipeline and the InSwapper model."""
    # Face detection / recognition pipeline (Buffalo_L contains detection + 3D landmarks + embeddings)
    app = FaceAnalysis(name="buffalo_l", providers=["CUDAExecutionProvider", "CPUExecutionProvider"])
    app.prepare(ctx_id=ctx_id, det_size=(det_size, det_size))

    # Face swapper model (128 x 128)
    inswapper = get_model("inswapper_128.onnx", download=True, providers=["CUDAExecutionProvider", "CPUExecutionProvider"], ctx_id=ctx_id)
    return app, inswapper


def read_image(path: str) -> np.ndarray:
    img = cv2.imread(path)
    if img is None:
        raise FileNotFoundError(f"Could not read image: {path}")
    return img


def main():
    args = parse_args()

    app, swapper = load_models(ctx_id=args.gpu, det_size=args.det_size)

    # --- Source face ---
    src_img = read_image(args.source)
    src_faces = app.get(src_img)
    if not src_faces:
        raise RuntimeError("No face detected in the source image. Make sure the face is clearly visible.")
    # Choose the largest face as source (in case multiple faces present)
    src_face = max(src_faces, key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1]))

    # --- Target faces ---
    tgt_img = read_image(args.target)
    tgt_faces = app.get(tgt_img)
    if not tgt_faces:
        raise RuntimeError("No face detected in the target image.")

    # Swap every detected face in the target image
    for face in tgt_faces:
        tgt_img = swapper.get(tgt_img, face, src_face, paste_back=True)

    # Ensure output directory exists
    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    cv2.imwrite(str(out_path), tgt_img)
    print(f"Saved swapped image to {out_path.resolve()}")


if __name__ == "__main__":
    main() 