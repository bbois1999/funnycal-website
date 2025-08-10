"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { CALENDAR_MONTHS, productData, type Template } from "@/lib/products";

type MonthSelection = {
  monthIndex: number;
  imageSrc: string | null;
  source: "template" | "upload" | null;
  templateKey: string | null;
};

const allCalendarTemplates: Record<string, Template> = productData.calendar.templates;

// Cover image per template (first image)
const getTemplateCover = (tmpl: Template) => tmpl.templateImages[0] ?? "";

export default function CustomCalendarBuilder() {
  const [currentMonthIdx, setCurrentMonthIdx] = useState(0);
  const [selections, setSelections] = useState<MonthSelection[]>(
    CALENDAR_MONTHS.map((_, idx) => ({ monthIndex: idx, imageSrc: null, source: null, templateKey: null }))
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [wizardStep, setWizardStep] = useState<"chooseTemplate" | "chooseImage" | "confirm">("chooseTemplate");
  const [workingSelectedTemplateKey, setWorkingSelectedTemplateKey] = useState<string | null>(null);
  const [workingSelectedImage, setWorkingSelectedImage] = useState<string | null>(null);
  const [workingSource, setWorkingSource] = useState<"template" | "upload" | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showChangeDialog, setShowChangeDialog] = useState(false);
  const [targetMonthToChange, setTargetMonthToChange] = useState<number | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<number, { kind: "face" | "template"; message: string }>>({});
  const [validationNotice, setValidationNotice] = useState<string | null>(null);

  // Face photo for swapping
  const faceFileInputRef = useRef<HTMLInputElement>(null);
  const [faceFile, setFaceFile] = useState<File | null>(null);
  const [facePreview, setFacePreview] = useState<string | null>(null);

  // Swap state/results
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapResults, setSwapResults] = useState<string[]>([]);
  const [swapError, setSwapError] = useState<string | null>(null);
  const [swapFailures, setSwapFailures] = useState<Array<{ file: string; reason: string; message: string }>>([]);
  const [outputFolderId, setOutputFolderId] = useState<string | null>(null);
  const [showResultsReveal, setShowResultsReveal] = useState(false);
  const [isFixingFailures, setIsFixingFailures] = useState(false);
  const [fixQueue, setFixQueue] = useState<number[]>([]);
  const [fixPointer, setFixPointer] = useState(0);

  const backToSelections = () => {
    setSwapResults([]);
    setOutputFolderId(null);
    setShowResultsReveal(false);
    setIsSwapping(false);
    setIsComplete(false);
    setWizardStep("chooseTemplate");
    setCurrentMonthIdx(0);
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
  };

  const monthIndexFromFailureFile = (file: string): number | null => {
    const m = file.match(/^(\d+)/);
    if (!m) return null;
    const idx = parseInt(m[1], 10) - 1;
    if (idx < 0 || idx > 11) return null;
    return idx;
  };

  const failedMonthIndices = useMemo(() => {
    const set = new Set<number>();
    for (const f of swapFailures) {
      const idx = monthIndexFromFailureFile(f.file);
      if (idx != null) set.add(idx);
    }
    return Array.from(set).sort((a, b) => a - b);
  }, [swapFailures]);

  const formatMonthList = (indices: number[]): string => {
    const names = indices.map((i) => CALENDAR_MONTHS[i]);
    if (names.length === 0) return '';
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} and ${names[1]}`;
    return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
  };

  const startFixFailures = () => {
    if (failedMonthIndices.length === 0) return;
    setIsFixingFailures(true);
    setFixQueue(failedMonthIndices);
    setFixPointer(0);
    const first = failedMonthIndices[0];
    const sel = selections[first];
    setIsComplete(false);
    setCurrentMonthIdx(first);
    setWorkingSelectedTemplateKey(sel.templateKey);
    setWorkingSelectedImage(sel.imageSrc);
    setWorkingSource(sel.source);
    setWizardStep("confirm");
    setShowResultsReveal(false);
    setSwapResults([]);
  };

  const chooseTemplate = (templateKey: string) => {
    setWorkingSelectedTemplateKey(templateKey);
    setWizardStep("chooseImage");
  };

  const chooseImage = (src: string) => {
    setWorkingSelectedImage(src);
    setWorkingSource("template");
    setWizardStep("confirm");
  };

  const onUploadClick = () => fileInputRef.current?.click();
  const onUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setWorkingSelectedImage(reader.result as string);
      setWorkingSource("upload");
      setWizardStep("confirm");
    };
    reader.readAsDataURL(file);
    // reset input for same file upload again
    e.currentTarget.value = "";
  };

  const allChosen = selections.every((s) => s.imageSrc);

  const confirmSelection = () => {
    if (!workingSelectedImage) return;
    setSelections((prev) => {
      const next = [...prev];
      next[currentMonthIdx] = {
        monthIndex: currentMonthIdx,
        imageSrc: workingSelectedImage,
        source: workingSource,
        templateKey: workingSelectedTemplateKey,
      };
      return next;
    });

    // advance to next month or finish
    if (isFixingFailures && fixQueue.length > 0) {
      const nextPtr = fixPointer + 1;
      if (nextPtr < fixQueue.length) {
        setFixPointer(nextPtr);
        const nextIdx = fixQueue[nextPtr];
        setWorkingSelectedTemplateKey(null);
        setWorkingSelectedImage(null);
        setWorkingSource(null);
        setWizardStep("chooseTemplate");
        setCurrentMonthIdx(nextIdx);
      } else {
        // Finished fixing; go to results stage again
        setIsFixingFailures(false);
        setIsComplete(true);
      }
    } else {
      if (currentMonthIdx < 11) {
        const nextIdx = currentMonthIdx + 1;
        setWorkingSelectedTemplateKey(null);
        setWorkingSelectedImage(null);
        setWorkingSource(null);
        setWizardStep("chooseTemplate");
        setCurrentMonthIdx(nextIdx);
      } else {
        setIsComplete(true);
      }
    }
  };

  const goBack = () => {
    if (wizardStep === "confirm") {
      setWizardStep("chooseImage");
      return;
    }
    if (wizardStep === "chooseImage") {
      setWizardStep("chooseTemplate");
      return;
    }
    // At chooseTemplate, go back a month if possible
    if (currentMonthIdx > 0) {
      const prevIdx = currentMonthIdx - 1;
      const prevSel = selections[prevIdx];
      setCurrentMonthIdx(prevIdx);
      if (prevSel.templateKey) {
        setWorkingSelectedTemplateKey(prevSel.templateKey);
        setWizardStep("chooseImage");
      } else {
        setWorkingSelectedTemplateKey(null);
        setWizardStep("chooseTemplate");
      }
    }
  };

  const discardWorkingAndGoTo = (monthIdx: number) => {
    const sel = selections[monthIdx];
    setCurrentMonthIdx(monthIdx);
    setWorkingSelectedImage(null);
    setWorkingSource(null);
    if (sel.source === "template" && sel.templateKey) {
      setWorkingSelectedTemplateKey(sel.templateKey);
      setWizardStep("chooseImage");
    } else {
      setWorkingSelectedTemplateKey(null);
      setWizardStep("chooseTemplate");
    }
  };

  const requestMonthChange = (monthIdx: number) => {
    const isPrev = monthIdx < currentMonthIdx || isComplete;
    if (!isPrev) return;
    const hasUnsaved = wizardStep !== "chooseTemplate" || !!workingSelectedImage;
    if (hasUnsaved) {
      setTargetMonthToChange(monthIdx);
      setShowChangeDialog(true);
    } else {
      discardWorkingAndGoTo(monthIdx);
    }
  };

  const handleConfirmChangeDialog = () => {
    if (targetMonthToChange == null) return;
    discardWorkingAndGoTo(targetMonthToChange);
    setShowChangeDialog(false);
    setTargetMonthToChange(null);
  };

  const handleCancelChangeDialog = () => {
    setShowChangeDialog(false);
    setTargetMonthToChange(null);
  };

  const handleContinueToFaceSwap = async () => {
    if (!allChosen || !faceFile) return;
    try {
      setIsValidating(true);
      setSwapError(null);
      setSwapResults([]);

      const monthsPayload = selections.map((s) => ({
        path: s.source === 'template' && typeof s.imageSrc === 'string' && !s.imageSrc.startsWith('data:') ? s.imageSrc : undefined,
        dataUrl: s.source === 'upload' ? (s.imageSrc as string) : undefined,
      }));

      const form = new FormData();
      form.append('photo', faceFile);
      form.append('months', JSON.stringify(monthsPayload));

      setIsSwapping(true);
      setShowResultsReveal(false);
      const response = await fetch('/api/custom-face-swap', { method: 'POST', body: form });
      const result = await response.json();
      if (result.success) {
        setSwapResults(result.output_files || []);
        if (result.output_folder_id) setOutputFolderId(result.output_folder_id);
        setSwapFailures(result.failures || []);
        // Reveal results and scroll to top
        setTimeout(() => setShowResultsReveal(true), 50);
        try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
      } else {
        setSwapError(result.error || 'Some pictures failed to process');
        setSwapFailures(result.failures || []);
        // Even if not success, if we have partial results, show them along with failures
        if (Array.isArray(result.output_files) && result.output_files.length > 0) {
          setSwapResults(result.output_files);
          if (result.output_folder_id) setOutputFolderId(result.output_folder_id);
          setTimeout(() => setShowResultsReveal(true), 50);
          try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
        }
      }
    } catch (e) {
      setSwapError('Failed to process face swap. Please try again.');
    } finally {
      setIsSwapping(false);
      setIsValidating(false);
    }
  };

  const addToCart = () => {
    if (!outputFolderId) return;
    const price = `$${productData.calendar.basePrice.toFixed(2)}`;
    const cartItem = {
      id: Date.now().toString(),
      type: 'calendar',
      template: 'custom',
      templateName: 'Custom Calendar',
      price,
      outputFolderId: outputFolderId,
      imageCount: swapResults.length,
      swapImages: swapResults.slice(0, 6),
      templateImage: selections[0]?.imageSrc || undefined,
    };
    const existingCart = JSON.parse(localStorage.getItem('funnycal-cart') || '[]');
    existingCart.push(cartItem);
    localStorage.setItem('funnycal-cart', JSON.stringify(existingCart));
    alert('Custom Calendar added to cart!');
  };

  const buyNow = () => {
    addToCart();
    window.location.href = '/cart';
  };

  const handleFaceUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    setFaceFile(file);
    const reader = new FileReader();
    reader.onload = () => setFacePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-3xl font-bold text-gray-800">
              Funny<span className="text-orange-500">Cal</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-600 hover:text-orange-500 transition-colors">
                Home
              </Link>
              <Link href="/calendar-templates" className="text-gray-600 hover:text-orange-500 transition-colors">
                Calendar Templates
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-orange-500 transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="text-sm">
            <Link href="/" className="text-gray-500 hover:text-orange-500">
              Home
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/calendar-templates" className="text-gray-500 hover:text-orange-500">
              Calendar Templates
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-800">Custom Calendar</span>
          </nav>
        </div>
      </section>

      {/* Builder (Guided) */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress */}
          <div className="mb-6 text-center">
            {!isComplete ? (
              <div className="inline-flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow">
                <span className="text-sm text-gray-600">Month</span>
                <span className="text-lg font-bold text-gray-800">{currentMonthIdx + 1}</span>
                <span className="text-sm text-gray-400">/ 12</span>
                <span className="text-gray-400">•</span>
                <span className="text-sm font-semibold text-gray-700">{CALENDAR_MONTHS[currentMonthIdx]}</span>
              </div>
            ) : (
              <h2 className="text-2xl font-bold text-gray-800">All months selected</h2>
            )}
          </div>

          {/* Quick month jump (previously chosen) */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {CALENDAR_MONTHS.map((label, idx) => {
                const sel = selections[idx];
                const isPast = isComplete || idx < currentMonthIdx || (idx === currentMonthIdx && wizardStep !== "chooseTemplate");
                const canJump = isPast && sel.imageSrc;
                return (
                  <button
                    key={label}
                    onClick={() => requestMonthChange(idx)}
                    disabled={!canJump}
                    className={`px-2 py-1 rounded text-xs font-semibold border ${
                      canJump ? "bg-white hover:bg-gray-50" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                    title={canJump ? `Change ${label}` : `${label}`}
                  >
                    {label.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>

          {!isComplete ? (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="px-5 py-4 border-b">
                {wizardStep === "chooseTemplate" && (
                  <h2 className="text-xl font-bold text-gray-800">
                    Pick a template for {CALENDAR_MONTHS[currentMonthIdx]}
                  </h2>
                )}
                {wizardStep === "chooseImage" && (
                  <h2 className="text-xl font-bold text-gray-800 capitalize">
                    Pick a picture from {workingSelectedTemplateKey}
                  </h2>
                )}
                {wizardStep === "confirm" && (
                  <h2 className="text-xl font-bold text-gray-800">Confirm your choice</h2>
                )}
              </div>

              {/* Step content */}
              <div className="p-5">
                {wizardStep === "chooseTemplate" && (
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {/* Upload your own tile */}
                      <div className="relative">
                        <button
                          onClick={onUploadClick}
                          className="w-full group relative rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-400 bg-white transition overflow-hidden text-center flex flex-col items-center justify-center p-4"
                        >
                          <div className="text-3xl mb-2">📸</div>
                          <div className="text-sm font-semibold text-gray-800">Upload your own</div>
                          <div className="text-[11px] text-gray-500 mt-1">1500×2000px+ recommended</div>
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={onUploadChange}
                        />
                      </div>

                      {Object.entries(allCalendarTemplates).map(([key, tmpl]) => (
                        <button
                          key={key}
                          onClick={() => chooseTemplate(key)}
                          className="group relative rounded-lg border bg-white hover:shadow-md transition overflow-hidden text-left"
                        >
                          <div className="relative w-full aspect-[3/4] bg-gray-100">
                            <Image src={getTemplateCover(tmpl)} alt={tmpl.name} fill className="object-cover" />
                          </div>
                          <div className="p-2">
                            <div className="text-sm font-semibold text-gray-800 capitalize">{key}</div>
                            <div className="text-xs text-gray-500 truncate">{tmpl.name}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {wizardStep === "chooseImage" && workingSelectedTemplateKey && (
                  <div>
                    <div className="mb-3 text-sm text-gray-600">
                      Recommended upload: 1500×2000px or higher (portrait), clear, evenly lit face looking toward the camera.
                      Avoid heavy sunglasses, extreme angles, or motion blur.
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {/* Upload tile */}
                      <button
                        onClick={onUploadClick}
                        className="relative aspect-[3/4] rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-400 grid place-items-center text-gray-500 font-semibold"
                      >
                        Upload your own
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onUploadChange}
                      />
                      {allCalendarTemplates[workingSelectedTemplateKey].templateImages.map((src) => (
                        <button
                          key={src}
                          onClick={() => chooseImage(src)}
                          className="relative w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-orange-400"
                        >
                          <Image src={src} alt="template" fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {wizardStep === "confirm" && workingSelectedImage && (
                  <div className="grid gap-4">
                    <div className="relative w-full max-w-2xl mx-auto aspect-[4/5] bg-gray-100 rounded overflow-hidden">
                      {workingSelectedImage.startsWith("data:") ? (
                        <img src={workingSelectedImage} alt="Selected" className="w-full h-full object-contain" />
                      ) : (
                        <Image src={workingSelectedImage} alt="Selected" fill className="object-contain" />
                      )}
                    </div>
                    <div className="mx-auto max-w-2xl text-sm text-gray-600">
                      Please ensure the face is clearly visible and recognizable. We’ll attempt the swap and will notify you
                      if any image fails automatic detection. If that happens, we’ll indicate whether you should replace the
                      person photo (face not detected) or the chosen scene for this month (template incompatibility).
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={goBack}
                        className="px-5 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold"
                      >
                        Go back
                      </button>
                      <button
                        onClick={() => {
                          // Jump to template selection to change this month
                          setWorkingSelectedTemplateKey(null);
                          setWorkingSelectedImage(null);
                          setWorkingSource(null);
                          setWizardStep("chooseTemplate");
                        }}
                        className="px-5 py-2 rounded bg-white border hover:bg-gray-50 text-gray-800 font-semibold"
                      >
                        Change picture
                      </button>
                      <button
                        onClick={confirmSelection}
                        className="px-6 py-2 rounded bg-orange-600 hover:bg-orange-700 text-white font-bold"
                      >
                        Confirm {CALENDAR_MONTHS[currentMonthIdx]}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom nav */}
              <div className="px-5 py-4 border-t flex items-center justify-between bg-gray-50">
                <button
                  onClick={goBack}
                  className="px-4 py-2 rounded bg-white border hover:bg-gray-100 text-gray-700 font-semibold"
                  disabled={currentMonthIdx === 0 && wizardStep === "chooseTemplate"}
                >
                  ← Back
                </button>
                <div className="text-sm text-gray-600">
                  {selections.filter((s) => s.imageSrc).length} of 12 selected
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              {/* Results reveal at the top */
              }
              {swapResults.length > 0 && (
                <div className={`transition-opacity duration-700 ${showResultsReveal ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-2">🎉</div>
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-1">Yay! Your swaps are ready</h2>
                    <p className="text-gray-600">Check out your 12-month transformation below</p>
                  </div>
                  {swapFailures.length > 0 && (
                    <div className="max-w-3xl mx-auto mb-6">
                      <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
                        <div className="font-semibold text-amber-800 mb-1">Some pictures failed</div>
                        <p className="text-sm text-amber-800 mb-3">A few scenes couldn’t detect a clear face. Please replace {formatMonthList(failedMonthIndices)} with images that have a clear, forward-facing face.</p>
                        <div className="mt-3 flex items-center gap-2">
                          <button onClick={startFixFailures} className="px-3 py-1.5 rounded bg-white border text-gray-800 text-sm font-semibold hover:bg-gray-50">Fix months now</button>
                          <button onClick={backToSelections} className="px-3 py-1.5 rounded bg-white border text-gray-800 text-sm font-semibold hover:bg-gray-50">Edit selections</button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="mb-5 flex items-center justify-center gap-3">
                    <button onClick={backToSelections} className="px-5 py-2 rounded bg-white border hover:bg-gray-50 text-gray-800 font-semibold">← Back to selections</button>
                    <button onClick={addToCart} disabled={failedMonthIndices.length>0} className={`px-5 py-2 rounded font-bold ${failedMonthIndices.length>0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 text-white'}`}>Add to Cart</button>
                    <button onClick={buyNow} disabled={failedMonthIndices.length>0} className={`px-5 py-2 rounded font-bold ${failedMonthIndices.length>0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}>Buy Now</button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
                    {swapResults.map((src: string) => (
                      <div key={src} className="relative w-full aspect-[3/4] bg-gray-100 rounded overflow-hidden shadow">
                        <Image src={src} alt="result" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Face photo upload and action buttons are hidden once results exist */}
              {swapResults.length === 0 && (
                <>
                  <div className="max-w-md mx-auto mb-6">
                    <div className="text-left mb-2 font-semibold text-gray-800">Upload your face photo</div>
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
                      <input ref={faceFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFaceUploadChange} />
                      {!facePreview ? (
                        <button onClick={() => faceFileInputRef.current?.click()} className="w-full py-3 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold">
                          Choose face photo
                        </button>
                      ) : (
                        <div className="relative h-56">
                          <img src={facePreview} alt="Face" className="w-full h-full object-cover rounded" />
                          <button onClick={() => faceFileInputRef.current?.click()} className="absolute bottom-2 right-2 px-3 py-1 rounded bg-white/90 border text-sm">
                            Change
                          </button>
                        </div>
                      )}
                      <div className="mt-2 text-xs text-gray-600">Tip: 1000×1000px+ square, clear face looking at camera.</div>
                    </div>
                  </div>
                  {!isSwapping && (
                    <button
                      disabled={!allChosen || !faceFile}
                      onClick={handleContinueToFaceSwap}
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-bold disabled:opacity-60"
                    >
                      Continue to Face Swap
                    </button>
                  )}
                </>
              )}
              {isSwapping && swapResults.length === 0 && (
                <div className="mt-2">
                  <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full">
                    <span className="animate-pulse">✨</span>
                    <span className="font-semibold">Swapping!</span>
                  </div>
                </div>
              )}
              {validationNotice && swapResults.length === 0 && (
                <div className="mt-3 text-sm text-gray-700">{validationNotice}</div>
              )}
              {!isSwapping && (
                <div className="mt-6 grid grid-cols-6 gap-2 transition-opacity duration-300">
                  {selections.map((s, idx) => (
                    <div key={idx} className={`relative aspect-square rounded overflow-hidden bg-gray-100 ${failedMonthIndices.includes(idx) ? 'ring-2 ring-red-500' : ''}`}>
                      {s.imageSrc ? (
                        s.imageSrc.startsWith("data:") ? (
                          <img src={s.imageSrc} alt={CALENDAR_MONTHS[idx]} className="w-full h-full object-cover" />
                        ) : (
                          <Image src={s.imageSrc} alt={CALENDAR_MONTHS[idx]} fill className="object-cover" />
                        )
                      ) : (
                        <div className="absolute inset-0 grid place-items-center text-gray-400 text-xs">{CALENDAR_MONTHS[idx].slice(0,3)}</div>
                      )}
                      {failedMonthIndices.includes(idx) && (
                        <div className="absolute bottom-1 left-1 right-1 bg-red-600/90 text-white text-[10px] font-bold px-1 py-0.5 rounded">
                          Needs change
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {/* Bottom buttons removed since actions are now above results */}
              <div className="mt-6">
                <button onClick={() => requestMonthChange(11)} className="text-sm text-gray-600 hover:underline">Go back to December</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Change dialog */}
      {showChangeDialog && targetMonthToChange != null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Change {CALENDAR_MONTHS[targetMonthToChange]}?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Your current in-progress month might not be saved. All previously selected months will remain the same.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={handleCancelChangeDialog} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold">
                Cancel
              </button>
              <button onClick={handleConfirmChangeDialog} className="px-4 py-2 rounded bg-orange-600 hover:bg-orange-700 text-white font-bold">
                Yes, change {CALENDAR_MONTHS[targetMonthToChange]}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">FunnyCal LLC</h3>
          <p className="text-gray-400 mb-6">Creating laughter, one face swap at a time</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/" className="hover:text-orange-400 transition-colors">
              Home
            </Link>
            <Link href="/calendar-templates" className="hover:text-orange-400 transition-colors">
              Calendar Templates
            </Link>
            <Link href="/contact" className="hover:text-orange-400 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}


