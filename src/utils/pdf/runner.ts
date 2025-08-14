// Dynamic import of html2pdf.js to reduce initial bundle size
type Html2PdfChain = {
  set: (opts: Record<string, unknown>) => Html2PdfChain;
  from: (el: HTMLElement) => { save: () => Promise<void> };
};
type Html2PdfFn = () => Html2PdfChain;

// Types
type PdfGenerateMessage = {
  type: "mdzen-generate-pdf";
  html: string;
  filename: string;
  options?: Record<string, unknown>;
};

// Utils
const postToOpener = (msg: Record<string, unknown>) => {
  try {
    window.opener?.postMessage(msg, "*");
  } catch {
    // ignore
  }
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const safeClose = () => {
  try {
    window.close();
  } catch {
    // ignore
  }
};

// Default options for html2pdf
const defaultOptions = {
  margin: [0.5, 0.5, 0.5, 0.5],
  image: { type: "jpeg", quality: 0.98 },
  html2canvas: {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
  },
  jsPDF: {
    unit: "in",
    format: "a4",
    orientation: "portrait",
    putOnlyUsedFonts: true,
    floatPrecision: 16,
  },
  pagebreak: { mode: ["avoid-all", "css", "legacy"] },
} as const;

// Signal readiness to the opener as soon as the runner is loaded
try {
  // Post soon after the event loop to ensure window.opener is set
  setTimeout(() => postToOpener({ type: "mdzen-pdf-ready" }), 0);
} catch {
  // ignore
}

// Listen for messages from the opener
window.addEventListener("message", async (event: MessageEvent) => {
  const data = (event && (event.data as PdfGenerateMessage)) || ({} as PdfGenerateMessage);
  if (!data || data.type !== "mdzen-generate-pdf") return;

  const { html, filename, options } = data;

  try {
    // Write provided HTML into this window's document
    document.open();
    document.write(html);
    document.close();

    // Wait a tick for layout/images
    await delay(50);

    const merged: Record<string, unknown> & { filename: string } = {
      ...defaultOptions,
      ...(options || {}),
      filename,
    };

    // Load html2pdf only when needed
    const { default: html2pdf } = (await import("html2pdf.js")) as unknown as {
      default: Html2PdfFn;
    };
    await html2pdf().set(merged).from(document.body as HTMLElement).save();

    // Notify opener of success
    postToOpener({ type: "mdzen-pdf-done", success: true });
  } catch (err) {
    try {
      // Fallback to print if html2pdf failed
      window.print();
    } catch {
      // ignore print errors
    }
    postToOpener({ type: "mdzen-pdf-done", success: false, error: String(err) });
  } finally {
    // Close this window shortly after
    setTimeout(safeClose, 300);
  }
});
