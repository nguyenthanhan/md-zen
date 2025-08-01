import html2pdf from "html2pdf.js";

export function downloadFile(
  filename: string,
  content: string,
  contentType: string
) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadAsPDF(
  htmlContent: string,
  filename: string = "document.pdf"
): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const element = document.createElement("div");
      element.innerHTML = htmlContent;
      element.style.cssText = `
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
        line-height: 1.6;
        color: #333;
        background: white;
      `;

      const options = {
        margin: 1,
        filename: filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
        },
        jsPDF: {
          unit: "in",
          format: "letter",
          orientation: "portrait",
        },
      };

      html2pdf()
        .set(options)
        .from(element)
        .save()
        .then(() => {
          resolve(true);
        })
        .catch((error: any) => {
          console.error("PDF generation failed:", error);
          resolve(false);
        });
    } catch (error) {
      console.error("PDF generation error:", error);
      resolve(false);
    }
  });
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (error) {
    console.error("Could not copy text:", error);
    return false;
  }
}

export function handleFileDrop(
  event: React.DragEvent,
  callback: (content: string) => void
) {
  event.preventDefault();
  if (event.dataTransfer.items) {
    for (let i = 0; i < event.dataTransfer.items.length; i++) {
      if (event.dataTransfer.items[i].kind === "file") {
        const file = event.dataTransfer.items[i].getAsFile();
        if (file && file.type === "text/markdown") {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target) {
              const content = e.target.result as string;
              callback(content);
            }
          };
          reader.readAsText(file);
        }
      }
    }
  }
}

export function setupDragAndDropArea(
  areaId: string,
  callback: (content: string) => void
) {
  const area = document.getElementById(areaId);
  if (area) {
    area.addEventListener("dragover", (e) => e.preventDefault());
    area.addEventListener("drop", (e) => {
      const dragEvent = e as unknown as React.DragEvent;
      handleFileDrop(dragEvent, callback);
    });
  }
}
