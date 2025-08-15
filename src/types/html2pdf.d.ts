declare module "html2pdf.js" {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: {
      type?: string;
      quality?: number;
    };
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      allowTaint?: boolean;
      backgroundColor?: string;
    };
    jsPDF?: {
      unit?: string;
      format?: string;
      orientation?: string;
      putOnlyUsedFonts?: boolean;
      floatPrecision?: number;
    };
    pagebreak?: {
      mode?: string[];
    };
    /**
     * Reserved for html2pdf’s built-in page header element.
     * Currently unsupported and always hidden via CSS in
     * `src/utils/pdf/download.ts`.
    +   */
    header?: null;

    /**
     * Reserved for html2pdf’s built-in page footer element.
     * Currently unsupported and always hidden via CSS in
     * `src/utils/pdf/download.ts`.
     */
    footer?: null;
  }

  interface Html2PdfInstance {
    set(options: Html2PdfOptions): Html2PdfInstance;
    from(element: HTMLElement): Html2PdfInstance;
    save(): Promise<void>;
  }

  function html2pdf(): Html2PdfInstance;
  export = html2pdf;
}
