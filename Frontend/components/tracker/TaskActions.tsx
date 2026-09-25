interface TaskActionsProps {
  onDelete: () => void;
}

export default function TaskActions({ onDelete }: TaskActionsProps) {
  return (
    <button
      type="button"
      onClick={onDelete}
      aria-label="Delete task"
      className="shrink-0 rounded p-1 text-ink-faint opacity-0 transition-opacity hover:bg-danger-tint hover:text-danger group-hover:opacity-100"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
