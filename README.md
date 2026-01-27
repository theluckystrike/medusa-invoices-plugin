<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  Medusa Invoice Plugin
</h1>

<h4 align="center">
  <a href="https://docs.medusajs.com">Documentation</a> |
  <a href="https://www.medusajs.com">Website</a>
</h4>

<p align="center">
  Building blocks for digital commerce
</p>
<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
    <a href="https://www.producthunt.com/posts/medusa"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Day-%23DA552E" alt="Product Hunt"></a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

## Compatibility

This starter is compatible with versions >= 2.11.3 and <= 2.13.1 of `@medusajs/medusa`. 

## Description

A comprehensive invoice generation plugin for MedusaJS that automatically generates PDF invoices for orders with customizable templates.

## Features

- 🧾 Automatic invoice generation on selected triggers (e.g. Order completed)
- 📄 PDF generation with customizable templates
- 🎨 Template management with versioning
- 📁 Integration with MedusaJS File Module
- 🔧 Admin UI for configuration and manual generation
- 🔔 Event-based architecture
- 📊 Invoice status tracking

## Installation

### Prerequisites

- MedusaJS server
- Configured File Module (S3, local, or other provider)
- Node.js 18+

Visit the [Quickstart Guide](https://docs.medusajs.com/learn/installation) to set up a server.
<br />
Visit the [Plugins documentation](https://docs.medusajs.com/learn/fundamentals/plugins) to learn more about plugins.
<br />
Visit the [Docs](https://docs.medusajs.com/learn/installation#get-started) to learn more about medusa system requirements.

### Install the plugin

```bash
npm install @@agilo/medusa-invoices-plugin
```

or with yarn:

```bash
yarn add @agilo/medusa-invoices-plugin
```

### Add to medusa-config.ts

```typescript
module.exports = defineConfig({
  projectConfig: {
    // ... other config
  },
  plugins: [
    {
      resolve: "@agilo/medusa-invoices-plugin",
      options: {
        // Additional options can be configured here
      },
    },
  ],
})
```

## Configuration

### Database Migrations

After installing the plugin, run migrations to create necessary database tables:

```bash
npx medusa db:migrate
```

or with yarn:

```bash
yarn medusa db:migrate
```

This will create tables for:
- Invoice settings
- Invoice records
- Store and invoice settings link
- Order and invoice link

### Initial Setup

1. **Configure File Module** (if not already configured)

The plugin requires a configured File Module to store generated PDF invoices.

#### Example: Local File Storage

```typescript
// medusa-config.ts
module.exports = {
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-local",
            id: "local",
            options: {
              // provider options...
            },
          },
        ],
      },
    },
  ],
}
```

#### Example: AWS S3 Storage

```typescript
// medusa-config.ts
module.exports = {
  // ...
  modules: [
    // ...
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              file_url: process.env.S3_FILE_URL,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION,
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_ENDPOINT,
              // other options...
            },
          },
        ],
      },
    },
  ],
}
```

Visit the [File Module documentation](https://docs.medusajs.com/resources/infrastructure-modules/file) to learn more about file module.

2. **Initial Plugin Configuration**

Access the Admin UI at `/app/settings/invoices` to:
- Set up default invoice template
- Set company information

## API Documentation

### Admin Endpoints

All admin endpoints require authentication with admin privileges.

#### Get Invoice Settings

```http
GET /admin/invoice-settings
```

**Response:**
```json
{
    "settings": {
        "id": "invset_01",
        "template_id": "clean",
        "template_version": "1.0.0",
        "header_logo_type": "text",
        "header_logo_text": "Agilo",
        "header_logo_url": null,
        "header_content": {},
        "footer_content": {},
        "store_name": "Store1",
        "store_address": "Some Street 218",
        "store_tax_id": "1",
        "bank_account_iban": "12345678910",
        "bank_account_swift": "25",
        "auto_generate_on": [],
        "created_at": "2025-12-17T12:30:24.315Z",
        "updated_at": "2026-01-27T08:20:43.756Z",
        "deleted_at": null
    },
    "templates": [
        {
            "id": "clean",
            "label": "Clean",
            "version": "1.0.0"
        },
        {
            "id": "classic",
            "label": "Classic",
            "version": "1.0.0"
        },
        {
            "id": "compact",
            "label": "Compact",
            "version": "1.0.0"
        }
    ],
    "availableTriggers": [
        "order.completed",
        "order.fulfillment_created",
        "payment.captured"
    ]
}
```

#### Update Invoice Settings

```http
POST /admin/invoice-settings
```

**Body:**
```json
{
  "template_id": "clean",
  "template_version": "1.0.0",
  "header_logo_type": "text",
  "header_logo_url": null,
  "header_logo_text": "Agilo",
  "header_content": {},
  "footer_content": {},
  "store_name": "Store2",
  "store_address": "Some Street 118",
  "store_tax_id": "2",
  "bank_account_iban": "10987654321",
  "bank_account_swift": "24",
  "auto_generate_on": []
}
```

**Response:**
```json
{
    "id": "invset_01",
    "template_id": "clean",
    "template_version": "1.0.0",
    "header_logo_type": "text",
    "header_logo_text": "Agilo",
    "header_logo_url": null,
    "header_content": {},
    "footer_content": {},
    "store_name": "Store2",
    "store_address": "Some Street 118",
    "store_tax_id": "2",
    "bank_account_iban": "10987654321",
    "bank_account_swift": "24",
    "auto_generate_on": [],
    "created_at": "2025-12-17T12:30:24.315Z",
    "updated_at": "2026-01-27T08:20:43.756Z",
    "deleted_at": null,
    "store_id": "store_01"
}
```

### Get Invoices by Order ID

```http
GET /admin/invoices/{order_id}
```

**Response:**
```json
{
    "invoices": [
        {
            "id": "inv_01",
            "status": "completed",
            "completed_at": "2026-01-26T10:27:31.450Z",
            "pdf_url": "http://inv_01.pdf",
            "template_id": "compact",
            "template_version": "1.0.0",
            "error_message": null,
            "order_display_id": 1,
            "created_by_event": "manual",
            "created_at": "2026-01-26T10:27:30.580Z"
        },
        {
            "id": "inv_02",
            "status": "completed",
            "completed_at": "2026-01-26T09:04:05.957Z",
            "pdf_url": "http://inv_02.pdf",
            "template_id": "compact",
            "template_version": "1.0.0",
            "error_message": null,
            "order_display_id": 2,
            "created_by_event": "manual",
            "created_at": "2026-01-26T09:04:05.620Z"
        }
    ],
    "count": 2,
    "offset": 0,
    "limit": 20
}
```

#### Get Invoice by Order ID

```http
GET /admin/invoices/{order_id}/recent
```

**Response:**
```json
{
    "status": "completed",
    "completed_at": "2026-01-26T13:43:15.758Z",
    "pdf_url": "http://inv_01.pdf",
    "template_id": "compact",
    "template_version": "1.0.0",
    "error_message": null,
    "order_display_id": 1,
    "created_by_event": "manual",
    "created_at": "2026-01-26T13:43:15.514Z"
}
```

#### Generate Invoice

```http
POST /admin/invoices/{order_id}/generate
```

**Body:**
```json
{
    "created_by_event": "manual"
    "template_id": "clean" // optional
}
```

**Response:**
```json
{
    "id": "inv_01",
    "order_id": "order_01",
    "order_display_id": 1,
    "status": "completed",
    "completed_at": "2026-01-27T09:32:12.233Z",
    "pdf_url": "http://inv_01.pdf",
    "template_id": "clean",
    "template_version": "1.0.0",
    "settings_snapshot": {
        "store_name": "Store1",
        "header_logo": {
            "url": null,
            "text": "Agilo",
            "type": "text"
        },
        "template_id": "clean",
        "store_tax_id": "1",
        "store_address": "Some Street 218",
        "footer_content": {},
        "header_content": {},
        "template_version": "1.0.0",
        "bank_account_iban": "12345678910",
        "bank_account_swift": "25"
    },
    "error_message": null,
    "created_by_event": "manual",
    "created_at": "2026-01-27T09:32:11.896Z",
    "updated_at": "2026-01-27T09:32:12.234Z",
    "deleted_at": null
}
```

### Store Endpoint

Customers can access their own invoices.

### Store Endpoint

Customers can access their own invoices.

#### Get Customer Invoice PDF url

```http
GET /store/invoices/{order_id}.pdf
```

**Response:**
```json
{
    invoice_id: "inv_01",
    invoice_pdf_url: "http://inv_01.pdf"
}
```

**Note:** Customers can only access invoices for their own orders. Authentication is required.
