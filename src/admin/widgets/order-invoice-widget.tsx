import { defineWidgetConfig } from "@medusajs/admin-sdk";
import {
  Button,
  Container,
  Heading,
  IconButton,
  StatusBadge,
  Text,
  toast,
} from "@medusajs/ui";
import { AdminOrder, DetailWidgetProps } from "@medusajs/framework/types";
import { useGenerateInvoice, useOrderInvoice } from "../hooks/invoices";
import { Link } from "@medusajs/icons";
import JsonViewSection from "../components/JsonViewSection";
import { InvoiceCreatedByEvent, InvoiceStatus } from "../../constants/invoice";
import CollapsiblePanel from "../components/CollapsiblePanel";
import InvoiceListModal from "../components/InvoiceListModal";
import React from "react";
import InvoiceDropdownMenu from "../components/InvoiceDropdownMenu";

const OrderInvoiceWidget = ({ data }: DetailWidgetProps<AdminOrder>) => {
  const orderId = data?.id;
  const invoiceQuery = useOrderInvoice(orderId, {
    refetchInterval: (query) => {
      const invoice = query.state.data;

      if (
        invoice?.status === InvoiceStatus.COMPLETED ||
        invoice?.status === InvoiceStatus.FAILED
      ) {
        return false;
      }

      return 3000;
    },
  });
  const generateInvoice = useGenerateInvoice(orderId!);

  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const handleGenerateInvoice = async () => {
    try {
      await generateInvoice.mutateAsync({
        created_by_event: InvoiceCreatedByEvent.MANUAL,
      });

      toast.success("Generated invoice", {
        description: "Invoice generated successfully",
      });
    } catch (error: any) {
      toast.error("Invoice not generated", {
        description: error.message || "Failed to generate invoice",
      });
    }
  };

  const invoice = invoiceQuery.data;
  let invoiceStatusBadge = <StatusBadge color="grey">Queued</StatusBadge>;

  if (
    generateInvoice.isPending ||
    invoice?.status == InvoiceStatus.GENERATING
  ) {
    invoiceStatusBadge = <StatusBadge color="blue">Generating</StatusBadge>;
  } else if (invoice?.status === InvoiceStatus.COMPLETED) {
    invoiceStatusBadge = <StatusBadge color="green">Completed</StatusBadge>;
  } else if (
    generateInvoice.isError ||
    invoice?.status === InvoiceStatus.FAILED
  ) {
    invoiceStatusBadge = <StatusBadge color="red">Failed</StatusBadge>;
  }

  if (!invoice) {
    return (
      <Container className="p-0 divide-y">
        <Heading
          level="h2"
          className="w-full flex justify-between items-center px-6 py-4"
        >
          Latest Invoice
          {invoiceStatusBadge}
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
            isLoading={generateInvoice.isPending}
          >
            {generateInvoice.isError ? "Retry" : "Generate Invoice"}
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="divide-y p-0">
      <Heading
        level="h2"
        className="w-full flex justify-between items-center px-6 py-4 gap-4"
      >
        Latest Invoice
        <div className="flex justify-between items-center gap-4">
          {invoiceStatusBadge}
          <InvoiceDropdownMenu setIsModalOpen={setIsModalOpen} />
        </div>
      </Heading>

      {invoice.status === InvoiceStatus.COMPLETED && (
        <>
          <div className="grid w-full grid-cols-2 items-center gap-4 px-6 py-4">
            <Text className="text-ui-fg-subtle" weight="plus" size="small">
              Template Version
            </Text>
            <Text className="text-ui-fg-muted whitespace-pre-line" size="small">
              {invoice.template_version}
            </Text>
          </div>

          <div className="grid w-full grid-cols-2 items-center gap-4 px-6 py-4">
            <Text className="text-ui-fg-subtle" weight="plus" size="small">
              Generated At
            </Text>
            <Text className="text-ui-fg-muted whitespace-pre-line" size="small">
              {new Date(invoice.completed_at!).toLocaleString()}
            </Text>
          </div>

          <div className="flex w-full items-center justify-between gap-4 px-6 py-4">
            <Text className="text-ui-fg-subtle" weight="plus" size="small">
              PDF Link
            </Text>
            <a href={invoice.pdf_url!}>
              <IconButton size="small" variant="transparent">
                <Link />
              </IconButton>
            </a>
          </div>
        </>
      )}

      {(generateInvoice.isError || invoice.status === InvoiceStatus.FAILED) && (
        <CollapsiblePanel
          label="Error"
          content={invoice.error_message || "Invoice generation failed"}
        />
      )}

      <div className="w-full items-center gap-4 px-6 py-4">
        <JsonViewSection data={invoice} />
      </div>

      <div className="flex justify-center items-center px-6 py-4">
        <Button
          onClick={handleGenerateInvoice}
          variant="secondary"
          disabled={generateInvoice.isPending}
          isLoading={generateInvoice.isPending}
        >
          {generateInvoice.isError || invoice.status === InvoiceStatus.FAILED
            ? "Retry"
            : "Generate New Invoice"}
        </Button>
      </div>

      <InvoiceListModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "order.details.side.after",
});

export default OrderInvoiceWidget;
