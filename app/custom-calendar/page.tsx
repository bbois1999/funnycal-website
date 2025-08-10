"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
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
    if (!allChosen) return;
    setIsValidating(true);
    setValidationNotice(null);
    setValidationErrors({});
    // Placeholder: integrate server-side validation here
    setTimeout(() => {
      setIsValidating(false);
      setValidationNotice(
        "We will validate your images during the face swap step and notify you if any month needs changes."
      );
    }, 600);
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
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Nice! Your custom calendar is ready</h2>
              <p className="text-gray-600 mb-6">We can now run face swap across your chosen scenes.</p>
              <button
                disabled={!allChosen}
                onClick={handleContinueToFaceSwap}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-bold disabled:opacity-60"
              >
                Continue to Face Swap
              </button>
              {isValidating && (
                <div className="mt-3 text-sm text-gray-600">Validating images…</div>
              )}
              {validationNotice && (
                <div className="mt-3 text-sm text-gray-700">{validationNotice}</div>
              )}
              <div className="mt-6 grid grid-cols-6 gap-2">
                {selections.map((s, idx) => (
                  <div key={idx} className="relative aspect-square rounded overflow-hidden bg-gray-100">
                    {s.imageSrc ? (
                      s.imageSrc.startsWith("data:") ? (
                        <img src={s.imageSrc} alt={CALENDAR_MONTHS[idx]} className="w-full h-full object-cover" />
                      ) : (
                        <Image src={s.imageSrc} alt={CALENDAR_MONTHS[idx]} fill className="object-cover" />
                      )
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-gray-400 text-xs">{CALENDAR_MONTHS[idx].slice(0,3)}</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button onClick={() => requestMonthChange(11)} className="text-sm text-gray-600 hover:underline">
                  Go back to December
                </button>
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


