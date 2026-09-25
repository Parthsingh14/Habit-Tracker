interface NotesEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const MAX_LENGTH = 10000;

export default function NotesEditor({ value, onChange, disabled }: NotesEditorProps) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        maxLength={MAX_LENGTH}
        placeholder="Goals, reminders, things to remember this month…"
        rows={8}
        className="w-full resize-y rounded-md border border-line bg-paper-surface p-3 text-sm text-ink placeholder:text-ink-faint disabled:opacity-60"
      />
      <div className="mt-1 text-right text-xs text-ink-faint">
        {value.length}/{MAX_LENGTH}
      </div>
    </div>
  );
}
