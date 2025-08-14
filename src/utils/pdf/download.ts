export function downloadAsPDF(
  htmlContent: string,
  filename: string = "document.pdf"
): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const buildHtmlDocument = (body: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MDZen - PDF</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; color: #333; background: #fff; }
    .html2pdf__header, .html2pdf__footer, [data-html2pdf-page-header], [data-html2pdf-page-footer] { display: none !important; }
    h1, h2, h3, h4, h5, h6 { margin: 1.2em 0 0.6em; line-height: 1.25; }
    h1 { font-size: 2em; }
    h2 { font-size: 1.6em; }
    h3 { font-size: 1.3em; }
    p { margin: 1em 0; }
    code { background: #f1f5f9; padding: 0.2em 0.4em; border-radius: 4px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; }
    pre { background: #0f172a; color: #e2e8f0; padding: 1rem; border-radius: 8px; overflow: auto; }
    pre code { background: transparent; padding: 0; }
    blockquote { border-left: 4px solid #e2e8f0; padding-left: 1rem; color: #4a5568; background: #f7fafc; padding: 1rem; border-radius: 0 5px 5px 0; }
    ul, ol { margin: 1em 0; padding-left: 2em; }
    li { margin: 0.5em 0; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    th, td { border: 1px solid #e2e8f0; padding: 0.5rem; text-align: left; }
    th { background: #f7fafc; font-weight: 600; }
    a { color: #3182ce; text-decoration: none; }
    a:hover { text-decoration: underline; }
    hr { border: none; border-top: 1px solid #e2e8f0; margin: 2em 0; }
    img { max-width: 100%; height: auto; }
  </style>
  </head>
  <body>
    ${body}
  </body>
  </html>`;

      // Open a dedicated PDF runner page in a new tab/window
      const features =
        "width=800,height=600,left=0,top=0,scrollbars=no,resizable=no,toolbar=0,location=0,menubar=0,status=0";
      const pdfWindow = window.open("", "_blank", features);

      if (!pdfWindow) {
        console.error("Could not open PDF window");
        resolve(false);
        return;
      }

      let settled = false;
      const settle = (ok: boolean) => {
        if (settled) return;
        settled = true;
        resolve(ok);
      };

      // Bootstrap the runner in the new window by injecting minimal HTML that imports the runner module
      try {
        const bootstrapHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><title>MDZen PDF</title></head><body><script type="module">import '/src/pdf/runner.ts';</script></body></html>`;
        pdfWindow.document.open();
        pdfWindow.document.write(bootstrapHtml);
        pdfWindow.document.close();
      } catch (e) {
        console.error("Failed to bootstrap PDF runner:", e);
      }

      // Safety timeout in case nothing comes back
      const globalTimeout = window.setTimeout(() => {
        try {
          // As a last resort, ask the new window to print its content and close
          pdfWindow.focus();
          pdfWindow.print();
          setTimeout(() => {
            try {
              pdfWindow.close();
            } catch {
              // ignore close errors
            }
            settle(true);
          }, 500);
        } catch {
          settle(false);
        }
      }, 10000);

      // Listen for completion and ready messages
      let runnerReady = false;
      const onMessage = (event: MessageEvent) => {
        const data = (event && event.data) || {};
        if (!data) return;
        if (data.type === "mdzen-pdf-ready") {
          runnerReady = true;
          // Once ready, send the payload
          postPayload();
          return;
        }
        if (data.type === "mdzen-pdf-done") {
          window.removeEventListener("message", onMessage);
          try {
            window.clearTimeout(globalTimeout);
          } catch {
            // ignore
          }
          try {
            pdfWindow.close();
          } catch {
            // ignore
          }
          settle(!!data.success);
        }
      };
      window.addEventListener("message", onMessage);

      // Post the payload to the new window when it's ready
      const postPayload = () => {
        try {
          const options = {
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

          const htmlToSend = /^\s*<!DOCTYPE/i.test(htmlContent)
            ? htmlContent
            : buildHtmlDocument(htmlContent);

          pdfWindow.postMessage(
            {
              type: "mdzen-generate-pdf",
              html: htmlToSend,
              filename,
              options,
            },
            "*"
          );
        } catch (err) {
          console.error("Failed to post PDF payload:", err);
        }
      };

      // If runner doesn't signal ready soon, attempt to send after a short delay
      setTimeout(() => {
        if (!runnerReady) postPayload();
      }, 200);
      // Also attempt after the window's onload
      pdfWindow.onload = () => postPayload();
    } catch (error) {
      console.error("PDF generation error:", error);
      resolve(false);
    }
  });
}
