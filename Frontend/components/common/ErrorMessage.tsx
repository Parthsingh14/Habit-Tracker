import Button from "@/components/common/Button";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-danger/30 bg-danger-tint px-4 py-3 text-sm text-danger">
      <span>{message}</span>
      {onRetry && (
        <Button variant="ghost" onClick={onRetry} className="!text-danger hover:!bg-danger/10">
          Retry
        </Button>
      )}
    </div>
  );
}
