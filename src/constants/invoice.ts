export enum InvoiceStatus {
  QUEUED = "queued",
  GENERATING = "generating",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum InvoiceTemplateId {
  CLEAN = "clean",
  CLASSIC = "classic",
  COMPACT = "compact",
}

export enum InvoiceSettingsHeaderLogoType {
  NONE = "none",
  TEXT = "text",
  IMAGE = "image",
}

export enum InvoiceSettingsAutoGenerateTrigger {
  ORDER_COMPLETED = "order.completed",
  FULFILLMENT_CREATED = "order.fulfillment_created",
  PAYMENT_CAPTURED = "payment.captured",
}

export enum InvoiceCreatedByEvent {
  ORDER_COMPLETED = "order.completed",
  FULFILLMENT_CREATED = "order.fulfillment_created",
  PAYMENT_CAPTURED = "payment.captured",
  MANUAL = "manual",
}
