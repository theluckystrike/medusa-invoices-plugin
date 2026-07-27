"use strict";

/**
 * CJS mock for @react-pdf/renderer (ESM-only package).
 *
 * Jest runs in CommonJS mode (even with --experimental-vm-modules) and cannot
 * natively `require()` ES-module-only packages.  The template files use
 * `await import("@react-pdf/renderer")` which SWC compiles to
 * `require("@react-pdf/renderer")`, causing an "ERR_REQUIRE_ESM" crash.
 *
 * This mock satisfies all usages inside the plugin:
 *   - Template IIFE factories (CleanTemplate, ClassicTemplate, CompactTemplate)
 *   - renderPdfStep in generate-invoice.ts
 */

const React = require("react");

// Minimal stub components that satisfy JSX rendering in Jest.
const stub =
  (name) =>
  ({ children, ...rest }) =>
    React.createElement(name, rest, children);

const Document = stub("mock-pdf-document");
const Page = stub("mock-pdf-page");
const Text = stub("mock-pdf-text");
const View = stub("mock-pdf-view");
const Image = stub("mock-pdf-image");
const Link = stub("mock-pdf-link");

const StyleSheet = {
  create: (styles) => styles,
  flatten: () => ({}),
  resolve: (style) => style || {},
};

const Font = {
  register: () => {},
  getFont: () => null,
  clear: () => {},
  load: async () => {},
};

// Used in renderPdfStep: must return a real Buffer.
const renderToBuffer = async () => Buffer.from("%PDF-1.4 mock-pdf-content");
const renderToString = async () => "%PDF-1.4 mock-pdf-content";
const renderToFile = async () => {};

const pdf = () => ({
  toBuffer: async () => Buffer.from("%PDF-1.4 mock-pdf-content"),
  toString: async () => "%PDF-1.4 mock-pdf-content",
  toBlob: async () => new Uint8Array(),
  updateContainer: () => {},
});

const PDFViewer = stub("mock-pdf-viewer");
const PDFDownloadLink = stub("mock-pdf-download-link");

module.exports = {
  Document,
  Page,
  Text,
  View,
  Image,
  Link,
  StyleSheet,
  Font,
  renderToBuffer,
  renderToString,
  renderToFile,
  pdf,
  PDFViewer,
  PDFDownloadLink,
};
