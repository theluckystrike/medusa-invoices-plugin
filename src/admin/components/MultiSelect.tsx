import { Badge, IconButton, Select } from "@medusajs/ui";
import { TemplateSettings } from "../routes/settings/invoices/page";
import { InvoiceSettingsAutoGenerateTrigger } from "../../constants/invoice";
import React from "react";
import { XMarkMini } from "@medusajs/icons";

type MultiSelectProps = {
  templateSettings: TemplateSettings;
  setTemplateSettings: React.Dispatch<React.SetStateAction<TemplateSettings>>;
};

const triggers = [
  {
    value: InvoiceSettingsAutoGenerateTrigger.ORDER_COMPLETED,
    label: "Order Completed",
  },
  {
    value: InvoiceSettingsAutoGenerateTrigger.FULFILLMENT_CREATED,
    label: "Fulfillment Created",
  },
  {
    value: InvoiceSettingsAutoGenerateTrigger.PAYMENT_CAPTURED,
    label: "Payment Captured",
  },
];

const MultiSelect = ({ templateSettings, setTemplateSettings }: MultiSelectProps) => {
  const [selectedValue, setSelectedValue] = React.useState("");

  const handleAddTrigger = (trigger: InvoiceSettingsAutoGenerateTrigger) => {
    setTemplateSettings((prev) => {
      const { auto_generate_on } = prev;

      if (!auto_generate_on.includes(trigger)) {
        return {
          ...prev,
          auto_generate_on: [...auto_generate_on, trigger],
        };
      }

      return prev;
    });

    setSelectedValue("");
  };

  const handleRemoveTrigger = (trigger: InvoiceSettingsAutoGenerateTrigger) => {
    setTemplateSettings((prev) => {
      const { auto_generate_on } = prev;

      if (auto_generate_on.includes(trigger)) {
        return {
          ...prev,
          auto_generate_on: auto_generate_on.filter((t) => t !== trigger),
        };
      }

      return prev;
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Select
        value={selectedValue}
        onValueChange={(value) => handleAddTrigger(value as InvoiceSettingsAutoGenerateTrigger)}
      >
        <Select.Trigger>
          <Select.Value placeholder="Select Auto Generation Triggers" />
        </Select.Trigger>

        <Select.Content>
          {triggers.map(
            (t) =>
              !templateSettings.auto_generate_on.includes(t.value) && (
                <Select.Item key={t.value} value={t.value}>
                  {t.label}
                </Select.Item>
              ),
          )}
        </Select.Content>
      </Select>

      <div className="mt-2 flex gap-2 flex-wrap">
        {templateSettings.auto_generate_on.map((t) => {
          const triggerLabel = triggers.find((tr) => tr.value === t)?.label;
          if (!triggerLabel) return null;

          return (
            <Badge key={t} size="xsmall" className="flex justify-between items-center gap-2">
              {triggerLabel}
              <IconButton
                variant="transparent"
                size="2xsmall"
                onClick={() => handleRemoveTrigger(t)}
              >
                <XMarkMini />
              </IconButton>
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default MultiSelect;
