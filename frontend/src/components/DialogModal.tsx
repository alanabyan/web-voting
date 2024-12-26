// src/components/UI/DialogModal.tsx

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import { Button } from "@/components/UI/button";

interface DialogModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  confirmButtonClass?: string;
  confirmButtonVariant?: "outline" | "destructive";
}

const DialogModal: React.FC<DialogModalProps> = ({
  isOpen,
  title,
  message,
  onClose,
  onConfirm,
  confirmLabel,
  confirmButtonClass,
  confirmButtonVariant
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p>{message}</p>
        <DialogFooter className="gap-y-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={confirmButtonVariant} className={confirmButtonClass} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogModal;
