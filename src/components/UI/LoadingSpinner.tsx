interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-20 text-center text-[var(--muted)]">
      <div className="h-10 w-10 rounded-full border-4 border-[var(--bg-card)] border-t-[var(--accent)] animate-spin-slow" />
      <span className="text-lg">{message}</span>
    </div>
  );
}
