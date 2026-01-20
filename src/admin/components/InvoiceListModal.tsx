import {
  Badge,
  createDataTableColumnHelper,
  createDataTableFilterHelper,
  DataTable,
  DataTableFilteringState,
  DataTablePaginationState,
  FocusModal,
  IconButton,
  //Heading,
  useDataTable,
} from "@medusajs/ui";
import React from "react";
import { InvoiceCreatedByEvent, InvoiceStatus } from "../../constants/invoice";
import { Link } from "@medusajs/icons";

const data = [
  {
    id: "1",
    created_by_event: "order.completed",
    status: "completed",
    template_version: "1.0.0",
    generated_at: "2026-01-13 12:11:12.197+00",
    pdf_link: "http://example.com",
  },
  {
    id: "2",
    created_by_event: "order.fulfillment_created",
    status: "failed",
    template_version: "1.0.0",
    generated_at: "2026-01-13 13:11:12.197+00",
    pdf_link: "http://example.com",
  },
  {
    id: "3",
    created_by_event: "payment.captured",
    status: "completed",
    template_version: "1.0.0",
    generated_at: "2026-01-13 10:11:12.197+00",
    pdf_link: "http://example.com",
  },
  {
    id: "4",
    created_by_event: "order.completed",
    status: "completed",
    template_version: "1.0.0",
    generated_at: "2026-01-13 10:15:12.197+00",
    pdf_link: "http://example.com",
  },
  {
    id: "5",
    created_by_event: "order.fulfillment_created",
    status: "failed",
    template_version: "1.0.0",
    generated_at: "2026-01-14 10:11:12.197+00",
    pdf_link: "http://example.com",
  },
  {
    id: "6",
    created_by_event: "payment.captured",
    status: "completed",
    template_version: "1.0.0",
    generated_at: "2026-01-15 10:11:12.197+00",
    pdf_link: "http://example.com",
  },
  {
    id: "7",
    created_by_event: "order.completed",
    status: "completed",
    template_version: "1.0.0",
    generated_at: "2026-01-11 10:11:12.197+00",
    pdf_link: "http://example.com",
  },
  {
    id: "8",
    created_by_event: "order.fulfillment_created",
    status: "failed",
    template_version: "1.0.0",
    generated_at: "2026-01-10 10:11:12.197+00",
    pdf_link: "http://example.com",
  },
  {
    id: "9",
    created_by_event: "payment.captured",
    status: "completed",
    template_version: "1.0.0",
    generated_at: "2026-01-13 10:41:12.197+00",
    pdf_link: "http://example.com",
  },
  {
    id: "10",
    created_by_event: "order.completed",
    status: "completed",
    template_version: "1.0.0",
    generated_at: "2026-01-01 10:11:12.197+00",
    pdf_link: "http://example.com",
  },
  {
    id: "11",
    created_by_event: "order.fulfillment_created",
    status: "failed",
    template_version: "1.0.0",
    generated_at: "2026-01-12 09:11:12.197+00",
    pdf_link: "http://example.com",
  },
  {
    id: "12",
    created_by_event: "payment.captured",
    status: "completed",
    template_version: "1.0.0",
    generated_at: "2026-01-16 10:11:12.197+00",
    pdf_link: "http://example.com",
  },
  {
    id: "13",
    created_by_event: "order.completed",
    status: "completed",
    template_version: "1.0.0",
    generated_at: "2026-01-17 10:11:12.197+00",
    pdf_link: "http://example.com",
  },
  {
    id: "14",
    created_by_event: "order.fulfillment_created",
    status: "failed",
    template_version: "1.0.0",
    generated_at: "2026-01-18 10:11:12.197+00",
    pdf_link: "http://example.com",
  },
  {
    id: "15",
    created_by_event: "payment.captured",
    status: "completed",
    template_version: "1.0.0",
    generated_at: "2026-01-13 08:11:12.197+00",
    pdf_link: "http://example.com",
  },
  {
    id: "16",
    created_by_event: "order.completed",
    status: "completed",
    template_version: "1.0.0",
    generated_at: "2026-01-13 07:11:12.197+00",
    pdf_link: "http://example.com",
  },
  {
    id: "17",
    created_by_event: "order.fulfillment_created",
    status: "failed",
    template_version: "1.0.0",
    generated_at: "2026-01-13 06:11:12.197+00",
    pdf_link: "http://example.com",
  },
  {
    id: "18",
    created_by_event: "payment.captured",
    status: "completed",
    template_version: "1.0.0",
    generated_at: "2026-01-13 05:11:12.197+00",
    pdf_link: "http://example.com",
  },
  // other data...
];

const columnHelper = createDataTableColumnHelper<(typeof data)[0]>();
const filterHelper = createDataTableFilterHelper<(typeof data)[0]>();

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
    cell: ({ getValue }) => {
      const raw = getValue();
      const date = new Date(raw);

      return date.toLocaleString();
    },
  }),
  columnHelper.accessor("pdf_link", {
    header: "PDF Link",
    cell: ({ getValue }) => {
      const pdfUrl = getValue();

      return (
        <a href={pdfUrl}>
          <IconButton size="small" variant="transparent">
            <Link />
          </IconButton>
        </a>
      );
    },
  }),
];

const filters = [
  filterHelper.accessor("created_by_event", {
    type: "select",
    label: "Event",
    options: [
      {
        label: InvoiceCreatedByEvent.ORDER_COMPLETED,
        value: InvoiceCreatedByEvent.ORDER_COMPLETED,
      },
      {
        label: InvoiceCreatedByEvent.FULFILLMENT_CREATED,
        value: InvoiceCreatedByEvent.FULFILLMENT_CREATED,
      },
      {
        label: InvoiceCreatedByEvent.PAYMENT_CAPTURED,
        value: InvoiceCreatedByEvent.PAYMENT_CAPTURED,
      },
      {
        label: InvoiceCreatedByEvent.MANUAL,
        value: InvoiceCreatedByEvent.MANUAL,
      },
    ],
  }),
  filterHelper.accessor("status", {
    type: "select",
    label: "Status",
    options: [
      { label: InvoiceStatus.COMPLETED, value: InvoiceStatus.COMPLETED },
      { label: InvoiceStatus.FAILED, value: InvoiceStatus.FAILED },
      { label: InvoiceStatus.GENERATING, value: InvoiceStatus.GENERATING },
    ],
  }),
  filterHelper.accessor("template_version", {
    type: "select",
    label: "Template Version",
    options: [
      // if you have multiple versions, list them here
      { label: "1.0.0", value: "1.0.0" },
    ],
  }),
];

type InvoiceListModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const limit = 14;

const InvoiceListModal = ({ isOpen, setIsOpen }: InvoiceListModalProps) => {
  const [pagination, setPagination] = React.useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  });
  const [filtering, setFiltering] = React.useState<DataTableFilteringState>({});

  const filteredData = React.useMemo(() => {
    return data.filter((row) => {
      return Object.entries(filtering).every(([key, value]) => {
        if (!value) {
          return true;
        }

        if (Array.isArray(value)) {
          // @ts-ignore
          return value.includes(row[key]);
        }

        if (typeof value === "string") {
          // @ts-ignore
          return row[key] === value;
        }

        return true;
      });
    });
  }, [filtering]);

  const shownData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = (pagination.pageIndex + 1) * pagination.pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pagination]);

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
    filtering: {
      state: filtering,
      onFilteringChange: setFiltering,
    },
    filters,
  });

  return (
    <FocusModal open={isOpen} onOpenChange={setIsOpen}>
      <FocusModal.Content>
        <FocusModal.Header className="h-[50px]">
          <FocusModal.Title>Invoices</FocusModal.Title>
        </FocusModal.Header>
        <FocusModal.Body className="flex flex-col h-full overflow-hidden">
          <DataTable instance={table} className="flex flex-col h-full">
            <DataTable.Toolbar className="flex-shrink-0 p-0 m-0"></DataTable.Toolbar>

            <div className="flex-1 overflow-y-auto min-h-0">
              <DataTable.Table />
            </div>

            <div className="flex-shrink-0">
              <DataTable.Pagination />
            </div>
          </DataTable>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};

export default InvoiceListModal;
