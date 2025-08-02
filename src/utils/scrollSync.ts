import { calculateScrollPercentage } from './common';
import { EDITOR_CONFIG } from './constants';

/**
 * Scroll synchronization utilities
 */

export class ScrollSyncManager {
  private isScrollingSyncRef: { current: boolean };
  private scrollSyncTimeoutRef: { current: number | null };

  constructor() {
    this.isScrollingSyncRef = { current: false };
    this.scrollSyncTimeoutRef = { current: null };
  }

  /**
   * Sync editor scroll to preview
   */
  syncEditorToPreview = (editorElement: HTMLElement): void => {
    if (this.isScrollingSyncRef.current) return;
    if (this.scrollSyncTimeoutRef.current) return;

    const scrollTop = editorElement.scrollTop;
    const scrollHeight = editorElement.scrollHeight - editorElement.clientHeight;
    const scrollPercentage = calculateScrollPercentage(
      scrollTop,
      editorElement.scrollHeight,
      editorElement.clientHeight
    );

    this.scrollSyncTimeoutRef.current = window.setTimeout(() => {
      const preview = document.querySelector('.preview') as HTMLElement;
      if (preview && !this.isScrollingSyncRef.current) {
        this.isScrollingSyncRef.current = true;

        const previewScrollHeight = preview.scrollHeight - preview.clientHeight;
        const targetScrollTop = scrollPercentage * previewScrollHeight;

        preview.scrollTop = targetScrollTop;

        setTimeout(() => {
          this.isScrollingSyncRef.current = false;
        }, 10);
      }
      this.scrollSyncTimeoutRef.current = null;
    }, EDITOR_CONFIG.debounce.scroll);
  };

  /**
   * Sync preview scroll to editor
   */
  syncPreviewToEditor = (previewElement: HTMLElement): void => {
    if (this.isScrollingSyncRef.current) return;
    if (this.scrollSyncTimeoutRef.current) return;

    const scrollPercentage = calculateScrollPercentage(
      previewElement.scrollTop,
      previewElement.scrollHeight,
      previewElement.clientHeight
    );

    this.scrollSyncTimeoutRef.current = window.setTimeout(() => {
      const editorScroller = document.querySelector('.cm-scroller') as HTMLElement;
      if (editorScroller && !this.isScrollingSyncRef.current) {
        this.isScrollingSyncRef.current = true;

        const editorScrollHeight = editorScroller.scrollHeight - editorScroller.clientHeight;
        const targetScrollTop = scrollPercentage * editorScrollHeight;

        editorScroller.scrollTop = targetScrollTop;

        setTimeout(() => {
          this.isScrollingSyncRef.current = false;
        }, 10);
      }
      this.scrollSyncTimeoutRef.current = null;
    }, EDITOR_CONFIG.debounce.scroll);
  };

  /**
   * Cleanup timeouts
   */
  cleanup = (): void => {
    if (this.scrollSyncTimeoutRef.current) {
      clearTimeout(this.scrollSyncTimeoutRef.current);
      this.scrollSyncTimeoutRef.current = null;
    }
  };
}
