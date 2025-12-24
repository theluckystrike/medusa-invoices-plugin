import { Plus } from "@medusajs/icons";
import { IconButton, Text } from "@medusajs/ui";
import React from "react";

const CollapsiblePanel = ({
  label,
  content,
}: {
  label: string;
  content: string;
}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  return (
    <div className="px-6 py-4">
      <Text
        className="text-ui-fg-subtle flex items-center justify-between gap-4"
        weight="plus"
        size="small"
      >
        {label}
        <IconButton
          onClick={() => setIsOpen(!isOpen)}
          size="small"
          variant="transparent"
        >
          <Plus
            className={`transition-transform ease-out duration-200 ${isOpen ? "rotate-45" : ""}`}
          />
        </IconButton>
      </Text>

      {isOpen && (
        <Text className="text-ui-fg-muted whitespace-pre-line" size="small">
          {content}
        </Text>
      )}
    </div>
  );
};

export default CollapsiblePanel;
