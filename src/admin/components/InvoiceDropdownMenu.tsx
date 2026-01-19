import { DocumentText, EllipsisHorizontal } from "@medusajs/icons";
import { DropdownMenu, IconButton } from "@medusajs/ui";

type InvoiceDropdownMenuProps = {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const InvoiceDropdownMenu = ({ setIsModalOpen }: InvoiceDropdownMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton variant="transparent" size="small">
          <EllipsisHorizontal />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item
          className="gap-x-2"
          onClick={() => setIsModalOpen(true)}
        >
          <DocumentText className="text-ui-fg-subtle" />
          View invoice history
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

export default InvoiceDropdownMenu;
