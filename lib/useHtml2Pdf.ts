// hooks/useHtml2Pdf.js
import { useCallback } from "react";

export const useHtml2Pdf = () => {
  const exportPdf = useCallback(async (elementId:any, filename = "document.pdf") => {
    const html2pdf = (await import("html2pdf.js")).default;

    const element = document.getElementById(elementId);
    if (!element) return;

    const options = {
  margin: 10,
  filename,
  image: { type: "jpeg" as const, quality: 0.98 },
  html2canvas: {
    scale: 2,
    useCORS: true,
    onclone: (clonedDoc: Document) => {
  const allElements = clonedDoc.querySelectorAll("*");

  allElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const computed = window.getComputedStyle(htmlEl);

    const propsToFix = [
      "color",
      "backgroundColor",
      "borderColor",
      "borderTopColor",
      "borderBottomColor",
      "borderLeftColor",
      "borderRightColor",
      "outlineColor",
      "boxShadow",
    ];

    propsToFix.forEach((prop) => {
      const value = computed[prop as keyof CSSStyleDeclaration] as string;
      if (value && (value.includes("lab(") || value.includes("oklch(") || value.includes("lch(") || value.includes("oklab("))) {
        // Fallback ke warna aman
        if (prop === "backgroundColor") {
          htmlEl.style.backgroundColor = "#ffffff";
        } else if (prop === "color") {
          htmlEl.style.color = "#000000";
        } else if (prop.toLowerCase().includes("border")) {
          htmlEl.style.setProperty(
            prop.replace(/([A-Z])/g, "-$1").toLowerCase(),
            "#e5e7eb"
          );
        } else if (prop === "boxShadow") {
          htmlEl.style.boxShadow = "none";
        }
      }
    });
  });
},
  },
  jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const },
};

    await html2pdf().set(options).from(element).save();
  }, []);

  return { exportPdf };
};