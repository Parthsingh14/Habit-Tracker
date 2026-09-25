"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { Task } from "@/types/task";

interface DeleteTaskModalProps {
  task: Task | null;
  onConfirm: (task: Task) => Promise<void>;
  onCancel: () => void;
}

export default function DeleteTaskModal({ task, onConfirm, onCancel }: DeleteTaskModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!task) return;
    setIsDeleting(true);
    try {
      await onConfirm(task);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={!!task} title="Delete this task?" onClose={onCancel}>
      <p className="mb-4 text-sm text-ink-muted">
        {task && (
          <>
            <span className="font-medium text-ink">&ldquo;{task.name}&rdquo;</span> will be
            removed from the tracker. Its completion history is kept, but it won&apos;t appear on
            the grid anymore.
          </>
        )}
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={isDeleting}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm} isLoading={isDeleting}>
          Delete task
        </Button>
      </div>
    </Modal>
  );
}
