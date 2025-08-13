import { calculateScrollPercentage } from "./common";

/**
 * High-performance scroll synchronization utilities
 * Optimized for smooth, lag-free scrolling
 */

export class ScrollSyncManager {
  private isScrollingSyncRef: { current: boolean };
  private rafId: number | null = null;
  private previewElement: HTMLElement | null = null;
  private editorElement: HTMLElement | null = null;
  private lastScrollTime = 0;
  private readonly THROTTLE_MS = 4; // ~240fps for ultra-smooth scrolling

  constructor() {
    this.isScrollingSyncRef = { current: false };
  }

  /**
   * Cache DOM elements for better performance
   */
  private cacheElements(): void {
    if (!this.previewElement) {
      this.previewElement = document.querySelector(".preview") as HTMLElement;
    }
    if (!this.editorElement) {
      this.editorElement = document.querySelector(
        ".cm-scroller"
      ) as HTMLElement;
    }
  }

  /**
   * Sync editor scroll to preview with ultra-smooth performance
   */
  syncEditorToPreview = (editorElement: HTMLElement): void => {
    if (this.isScrollingSyncRef.current) return;

    // High-frequency throttling for ultra-smooth scrolling
    const now = performance.now();
    if (now - this.lastScrollTime < this.THROTTLE_MS) return;
    this.lastScrollTime = now;

    // Cancel any pending animation frame
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    // Use requestAnimationFrame for smooth, non-blocking scrolling
    this.rafId = requestAnimationFrame(() => {
      this.cacheElements();

      if (!this.previewElement || this.isScrollingSyncRef.current) return;

      const scrollPercentage = calculateScrollPercentage(
        editorElement.scrollTop,
        editorElement.scrollHeight,
        editorElement.clientHeight
      );

      this.isScrollingSyncRef.current = true;

      // Edge snapping and pixel rounding to avoid resistance near extremes
      const editorMax = editorElement.scrollHeight - editorElement.clientHeight;
      const atTop = editorElement.scrollTop <= 1;
      const atBottom = editorMax - editorElement.scrollTop <= 1;

      const previewScrollHeight =
        this.previewElement.scrollHeight - this.previewElement.clientHeight;
      const targetScrollTop = atTop
        ? 0
        : atBottom
        ? previewScrollHeight
        : Math.round(scrollPercentage * previewScrollHeight);

      // Direct assignment for instant, lag-free sync
      this.previewElement.scrollTop = targetScrollTop;

      // Reset sync flag immediately for maximum responsiveness
      this.isScrollingSyncRef.current = false;
    });
  };

  /**
   * Sync preview scroll to editor with ultra-smooth performance
   */
  syncPreviewToEditor = (previewElement: HTMLElement): void => {
    if (this.isScrollingSyncRef.current) return;

    // High-frequency throttling for ultra-smooth scrolling
    const now = performance.now();
    if (now - this.lastScrollTime < this.THROTTLE_MS) return;
    this.lastScrollTime = now;

    // Cancel any pending animation frame
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    // Use requestAnimationFrame for smooth, non-blocking scrolling
    this.rafId = requestAnimationFrame(() => {
      this.cacheElements();

      if (!this.editorElement || this.isScrollingSyncRef.current) return;

      const scrollPercentage = calculateScrollPercentage(
        previewElement.scrollTop,
        previewElement.scrollHeight,
        previewElement.clientHeight
      );

      this.isScrollingSyncRef.current = true;

      // Edge snapping and pixel rounding to avoid resistance near extremes
      const previewMax =
        previewElement.scrollHeight - previewElement.clientHeight;
      const atTop = previewElement.scrollTop <= 1;
      const atBottom = previewMax - previewElement.scrollTop <= 1;

      const editorScrollHeight =
        this.editorElement.scrollHeight - this.editorElement.clientHeight;
      const targetScrollTop = atTop
        ? 0
        : atBottom
        ? editorScrollHeight
        : Math.round(scrollPercentage * editorScrollHeight);

      // Direct assignment for instant, lag-free sync
      this.editorElement.scrollTop = targetScrollTop;

      // Reset sync flag immediately for maximum responsiveness
      this.isScrollingSyncRef.current = false;
    });
  };

  /**
   * Cleanup animation frames
   */
  cleanup = (): void => {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.isScrollingSyncRef.current = false;
  };
}
