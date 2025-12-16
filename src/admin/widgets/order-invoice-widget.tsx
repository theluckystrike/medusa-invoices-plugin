import { defineWidgetConfig } from "@medusajs/admin-sdk";
import {
  Button,
  Container,
  DropdownMenu,
  Heading,
  IconButton,
  Text,
  toast,
} from "@medusajs/ui";
import { AdminOrder, DetailWidgetProps } from "@medusajs/framework/types";
import { useGenerateInvoice, useOrderInvoice } from "../hooks/invoices";
import {
  ArrowDownTray,
  ArrowUpRightOnBox,
  EllipsisHorizontal,
  Spinner,
} from "@medusajs/icons";
import React from "react";
import MyFocusModal from "../components/MyFocusModal";

const OrderInvoiceWidget = ({ data }: DetailWidgetProps<AdminOrder>) => {
  const orderId = data?.id;
  const invoiceQuery = useOrderInvoice(orderId);
  const generateInvoice = useGenerateInvoice(orderId!);

  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const handleGenerateInvoice = async () => {
    try {
      await generateInvoice.mutateAsync();

      toast.success("Generated invoice", {
        description: "Invoice generated successfully",
      });
    } catch (error: any) {
      toast.error("Invoice not generated", {
        description: error.message || "Failed to generate invoice",
      });
    }
  };

  if (!invoiceQuery.data) {
    return (
      <Container className="p-0 divide-y">
        <Heading level="h2" className="px-6 py-4">
          Invoice Template
        </Heading>

        <div className="flex flex-col items-center justify-center gap-y-4 p-6">
          <Text
            className="text-center text-ui-fg-subtle"
            size="small"
            weight="plus"
          >
            No invoice has been generated for this order
          </Text>

          <Button
            onClick={handleGenerateInvoice}
            variant="secondary"
            disabled={generateInvoice.isPending}
          >
            {generateInvoice.isPending ? <Spinner /> : "Generate Invoice"}
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="divide-y p-0">
      <Heading
        level="h2"
        className="w-full flex justify-between items-center px-6 py-4"
      >
        Invoice Template
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <IconButton size="small" variant="transparent">
              <EllipsisHorizontal />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item
              onSelect={() => setIsModalOpen(true)}
              className="flex gap-2 items-center"
            >
              <ArrowUpRightOnBox className="text-ui-fg-subtle" />
              Preview
            </DropdownMenu.Item>
            <DropdownMenu.Item className="flex gap-2 items-center">
              <ArrowDownTray className="text-ui-fg-subtle" />
              Download
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </Heading>

      <div className="grid w-full grid-cols-2 items-center gap-4 px-6 py-4">
        <Text className="text-ui-fg-subtle" weight="plus" size="small">
          Number
        </Text>
        <Text className="text-ui-fg-muted whitespace-pre-line" size="small">
          {invoiceQuery.data.number}
        </Text>
      </div>

      <div className="grid w-full grid-cols-2 items-center gap-4 px-6 py-4">
        <Text className="text-ui-fg-subtle" weight="plus" size="small">
          Created At
        </Text>
        <Text className="text-ui-fg-muted whitespace-pre-line" size="small">
          {new Date(invoiceQuery.data.created_at).toLocaleDateString()}
        </Text>
      </div>

      <div className="flex justify-center items-center px-6 py-4">
        <Button
          onClick={handleGenerateInvoice}
          variant="secondary"
          disabled={generateInvoice.isPending}
        >
          {generateInvoice.isPending ? <Spinner /> : "Generate New Invoice"}
        </Button>
      </div>

      <MyFocusModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        orderId={orderId}
      />
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "order.details.side.after",
});

export default OrderInvoiceWidget;
