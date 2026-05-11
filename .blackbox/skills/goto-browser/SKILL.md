---
name: goto-browser
description: Opens a new browser page or navigates to a URL in the integrated browser when the user wants to access web content.
---

# Goto Browser

## Instructions

Use this skill when the user requests to open a browser, navigate to a website, or access web-based content. Call the open_browser_page tool with the specified URL if provided, or without a URL to prompt the user to share an existing page. Ensure to reuse existing pages when possible to avoid unnecessary new tabs.

## Examples

- User: "Open Google" → Call open_browser_page with url="https://www.google.com"
- User: "Go to the browser" → Call open_browser_page without url if no shared pages exist
