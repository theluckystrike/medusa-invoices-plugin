import { FocusModal } from "@medusajs/ui";
import { Dispatch, SetStateAction } from "react";

type MyFocusModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export default function MyFocusModal({
  isModalOpen,
  setIsModalOpen,
}: MyFocusModalProps) {
  return (
    <FocusModal open={isModalOpen} onOpenChange={setIsModalOpen}>
      <FocusModal.Content>
        <FocusModal.Header>
          <FocusModal.Title>Invoice Preview</FocusModal.Title>
        </FocusModal.Header>
        <FocusModal.Body className="flex flex-col items-center py-16"></FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
}
