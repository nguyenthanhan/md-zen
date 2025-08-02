// html2pdf is now loaded dynamically in the new window

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
      // Use a completely isolated approach - create a new window
      const printWindow = window.open(
        "",
        "_blank",
        "width=800,height=600,scrollbars=yes,resizable=yes"
      );

      if (!printWindow) {
        console.error("Could not open print window");
        resolve(false);
        return;
      }

      // Write content to the new window
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load, then trigger PDF download
      printWindow.onload = () => {
        try {
          // Use html2pdf on the new window's document
          const options = {
            margin: [0.5, 0.5, 0.5, 0.5], // top, right, bottom, left margins
            filename: filename,
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
            // Remove header and footer
            header: null,
            footer: null,
          };

          // Import html2pdf in the new window context
          const script = printWindow.document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
          script.onload = () => {
            try {
              // Use html2pdf from the new window
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const html2pdfFn = (printWindow as any).html2pdf;
              if (html2pdfFn) {
                html2pdfFn()
                  .set(options)
                  .from(printWindow.document.body)
                  .save()
                  .then(() => {
                    console.log("PDF generated successfully");
                    printWindow.close();
                    resolve(true);
                  })
                  .catch((error: unknown) => {
                    console.error(
                      "PDF generation failed, falling back to print:",
                      error
                    );
                    // Fallback to print
                    printWindow.print();
                    setTimeout(() => {
                      printWindow.close();
                      resolve(true);
                    }, 1000);
                  });
              } else {
                // html2pdf not available, use print
                printWindow.print();
                setTimeout(() => {
                  printWindow.close();
                  resolve(true);
                }, 1000);
              }
            } catch (error) {
              console.error(
                "PDF generation error, using print fallback:",
                error
              );
              printWindow.print();
              setTimeout(() => {
                printWindow.close();
                resolve(true);
              }, 1000);
            }
          };
          script.onerror = () => {
            console.log("html2pdf not available, using print fallback");
            printWindow.print();
            setTimeout(() => {
              printWindow.close();
              resolve(true);
            }, 1000);
          };
          printWindow.document.head.appendChild(script);
        } catch (error) {
          console.error("Error in print window:", error);
          printWindow.print();
          setTimeout(() => {
            printWindow.close();
            resolve(true);
          }, 1000);
        }
      };

      // Fallback if onload doesn't fire
      setTimeout(() => {
        if (printWindow.document.readyState === "complete") {
          printWindow.print();
          setTimeout(() => {
            printWindow.close();
            resolve(true);
          }, 1000);
        }
      }, 2000);
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
