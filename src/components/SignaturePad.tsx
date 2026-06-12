import React, { useRef, useState, useEffect } from "react";

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  onClear: () => void;
  savedImage: string;
}

export default function SignaturePad({ onSave, onClear, savedImage }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas and configure styles
    ctx.strokeStyle = "#0F172A"; // Dark slate signature ink
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // If there is a saved image, draw it (only if not drawing new)
    if (savedImage && !hasDrawn) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = savedImage;
    }
  }, [savedImage, hasDrawn]);

  // Handle canvas scaling
  const getCoordinates = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    // Support touch and mouse events
    if (e.touches) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    // Prevent scrolling on touch devices
    if (e.cancelable) e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if (e.cancelable) e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (canvas) {
      onSave(canvas.toDataURL("image/png"));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onClear();
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-semibold text-[#8C8479] tracking-wider uppercase">
          Option A: Draw Signature Directly
        </label>
        {(hasDrawn || savedImage) && (
          <button
            type="button"
            onClick={clearCanvas}
            className="text-xs text-rose-600 hover:text-rose-500 transition font-medium flex items-center gap-1 cursor-pointer"
            id="clear_signature_btn"
          >
            Clear Signature Pad
          </button>
        )}
      </div>
      <div className="relative border border-[#EBE5DE] rounded-xl bg-[#FAF9F7] overflow-hidden cursor-crosshair">
        <canvas
          id="signature_canvas"
          ref={canvasRef}
          width={400}
          height={150}
          className="w-full h-[150px] bg-white opacity-95 block"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasDrawn && !savedImage && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-[#8C8479] text-center px-4">
            Draw your signature here using mouse or touch pad
          </div>
        )}
      </div>
    </div>
  );
}
