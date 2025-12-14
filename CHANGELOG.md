
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2025-11-15
### Added
- **Gemini 3.0 Pro Integration:** Migrated core resume logic to `gemini-3-pro-preview` for deep reasoning.
- **Veo Video Generation:** Added `veo-3.1` support for cinematic personal brand intros.
- **Image Generation:** Added `gemini-3-pro-image-preview` for AI headshot synthesis.
- **Enterprise Docs:** Added comprehensive `docs/` folder structure and `AGENTS.md`.
- **Gap Analysis V2:** Interactive "Fix this gap" workflow.

### Changed
- Refactored `ResumeInput.tsx` to support "Thinking Mode" configurations.
- Updated `ResumePreview.tsx` to handle robust skills array parsing.
- Migrated PDF generation engine to Vector-based `html2canvas` + `jspdf` approach.

### Fixed
- Fixed `skills.map is not a function` error by adding defensive parsing in `geminiService.ts`.
- Fixed MIME type detection for resume uploads.

## [1.0.0] - 2024-10-01
### Added
- Initial release of AI Resume Artisan.
- Basic resume generation with `gemini-1.5-flash`.
- Local Storage persistence.
