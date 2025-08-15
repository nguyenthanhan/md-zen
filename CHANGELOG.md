# Changelog

All notable changes to the project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4] - 2025-08-15

### Added

- **Enhanced PDF Generation**: Fixed popup blocker issues by opening PDF window synchronously
- **Code Refactoring**: Eliminated duplication by implementing shared HTML document builder function
- **Security Improvements**: Added origin validation for PDF window message handling
- **Improved Maintainability**: Centralized HTML template logic in fileHelpers.ts

### Changed

- **PDF Download Function**: Updated to accept both string and Promise<string> for better async handling
- **HTML Document Builder**: Enhanced buildBaseHtmlDocument function with optional title and styles parameters
- **Code Organization**: Moved common HTML generation logic to shared utility functions

### Fixed

- **Popup Blocker Issues**: PDF generation now works reliably without being blocked by browser popup blockers
- **Code Duplication**: Removed duplicate HTML template logic between PDF and HTML download functions
- **Async PDF Generation**: Improved handling of markdown parsing promises in PDF generation workflow

---

_This changelog will be updated with each new release to document all changes, improvements, and new features._
