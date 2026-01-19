import {
  Badge,
  createDataTableColumnHelper,
  DataTable,
  DataTablePaginationState,
  FocusModal,
  //Heading,
  useDataTable,
} from "@medusajs/ui";
import React from "react";
import { InvoiceStatus } from "../../constants/invoice";

const data = [
  {
    id: "1",
    created_by_event: "order.completed",
    status: "completed",
    template_version: "1.0.0",
    generated_at: "08.01.2026",
    pdf_link: "http://example.com",
  },
  {
    id: "2",
    created_by_event: "order.fulfillment_created",
    status: "failed",
    template_version: "1.0.0",
    generated_at: "01.01.2026",
    pdf_link: "http://example.com",
  },
  {
    id: "3",
    created_by_event: "payment.captured",
    status: "completed",
    template_version: "1.0.0",
    generated_at: "16.01.2026",
    pdf_link: "http://example.com",
  },
  {
    id: "4",
    created_by_event: "order.completed",
    status: "completed",
    template_version: "1.0.0",
    generated_at: "08.01.2026",
    pdf_link: "http://example.com",
  },
  {
    id: "5",
    created_by_event: "order.fulfillment_created",
    status: "failed",
    template_version: "1.0.0",
    generated_at: "01.01.2026",
    pdf_link: "http://example.com",
  },
  {
    id: "6",
    created_by_event: "payment.captured",
    status: "completed",
    template_version: "1.0.0",
    generated_at: "16.01.2026",
    pdf_link: "http://example.com",
  },
  {
    id: "7",
    created_by_event: "order.completed",
    status: "completed",
    template_version: "1.0.0",
    generated_at: "08.01.2026",
    pdf_link: "http://example.com",
  },
  {
    id: "8",
    created_by_event: "order.fulfillment_created",
    status: "failed",
    template_version: "1.0.0",
    generated_at: "01.01.2026",
    pdf_link: "http://example.com",
  },
  {
    id: "9",
    created_by_event: "payment.captured",
    status: "completed",
    template_version: "1.0.0",
    generated_at: "16.01.2026",
    pdf_link: "http://example.com",
  },
  {
    id: "10",
    created_by_event: "order.completed",
    status: "completed",
    template_version: "1.0.0",
    generated_at: "08.01.2026",
    pdf_link: "http://example.com",
  },
  {
    id: "11",
    created_by_event: "order.fulfillment_created",
    status: "failed",
    template_version: "1.0.0",
    generated_at: "01.01.2026",
    pdf_link: "http://example.com",
  },
  {
    id: "12",
    created_by_event: "payment.captured",
    status: "completed",
    template_version: "1.0.0",
    generated_at: "16.01.2026",
    pdf_link: "http://example.com",
  },
  {
    id: "13",
    created_by_event: "order.completed",
    status: "completed",
    template_version: "1.0.0",
    generated_at: "08.01.2026",
    pdf_link: "http://example.com",
  },
  {
    id: "14",
    created_by_event: "order.fulfillment_created",
    status: "failed",
    template_version: "1.0.0",
    generated_at: "01.01.2026",
    pdf_link: "http://example.com",
  },
  {
    id: "15",
    created_by_event: "payment.captured",
    status: "completed",
    template_version: "1.0.0",
    generated_at: "16.01.2026",
    pdf_link: "http://example.com",
  },
  {
    id: "16",
    created_by_event: "order.completed",
    status: "completed",
    template_version: "1.0.0",
    generated_at: "08.01.2026",
    pdf_link: "http://example.com",
  },
  {
    id: "17",
    created_by_event: "order.fulfillment_created",
    status: "failed",
    template_version: "1.0.0",
    generated_at: "01.01.2026",
    pdf_link: "http://example.com",
  },
  {
    id: "18",
    created_by_event: "payment.captured",
    status: "completed",
    template_version: "1.0.0",
    generated_at: "16.01.2026",
    pdf_link: "http://example.com",
  },
  // other data...
];

const columnHelper = createDataTableColumnHelper<(typeof data)[0]>();

const columns = [
  columnHelper.accessor("created_by_event", {
    header: "Created By Event",
    enableSorting: true,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue();
      let badgeColor:
        | "grey"
        | "green"
        | "red"
        | "blue"
        | "orange"
        | "purple"
        | undefined;

      if (status === InvoiceStatus.COMPLETED) {
        badgeColor = "green";
      } else if (status === InvoiceStatus.FAILED) {
        badgeColor = "red";
      } else if (status === InvoiceStatus.GENERATING) {
        badgeColor = "blue";
      }

      return (
        <Badge color={badgeColor} size="xsmall">
          {status}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("template_version", {
    header: "Template Version",
  }),
  columnHelper.accessor("generated_at", {
    header: "Generated At",
  }),
  columnHelper.accessor("pdf_link", {
    header: "PDF Link",
  }),
];

type InvoiceListModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PAGE_SIZE = 14;

const InvoiceListModal = ({ isOpen, setIsOpen }: InvoiceListModalProps) => {
  const [pagination, setPagination] = React.useState<DataTablePaginationState>({
    pageSize: PAGE_SIZE,
    pageIndex: 0,
  });

  const shownData = React.useMemo(() => {
    return data.slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize,
    );
  }, [pagination]);

  const table = useDataTable({
    data: shownData,
    columns,
    rowCount: data.length,
    getRowId: (product) => product.id,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
    isLoading: false,
  });

  return (
    <FocusModal open={isOpen} onOpenChange={setIsOpen}>
      <FocusModal.Content>
        <FocusModal.Header>
          <FocusModal.Title>Invoices</FocusModal.Title>
        </FocusModal.Header>
        <DataTable instance={table} className="w-full">
          <FocusModal.Body className="flex flex-col items-center w-full">
            {/*<DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
              <Heading>Invoices</Heading>
            </DataTable.Toolbar>*/}

            <div className="max-h-[80vh] w-full overflow-y-auto">
              <DataTable.Table />
            </div>
          </FocusModal.Body>

          <FocusModal.Footer>
            <DataTable.Pagination />
          </FocusModal.Footer>
        </DataTable>
      </FocusModal.Content>
    </FocusModal>
  );
};

export default InvoiceListModal;
