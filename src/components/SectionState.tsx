import { AlertCircle, Inbox, Loader2 } from 'lucide-react';

/**
 * Shared loading / error / empty blocks so every data-backed section handles
 * all four states (loading, error, empty, success) with the same look.
 */

export const LoadingState = ({ label }: { label: string }) => (
  <div
    className="glass rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-center"
    role="status"
    aria-live="polite"
  >
    <Loader2 className="w-6 h-6 text-primary animate-spin" aria-hidden="true" />
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

export const ErrorState = ({ label }: { label: string }) => (
  <div
    className="glass rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-center border border-destructive/30"
    role="alert"
  >
    <AlertCircle className="w-6 h-6 text-destructive" aria-hidden="true" />
    <p className="text-sm text-foreground font-medium">{label}</p>
    <p className="text-xs text-muted-foreground">
      Please check your connection and try again.
    </p>
  </div>
);

export const EmptyState = ({ label }: { label: string }) => (
  <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-center">
    <Inbox className="w-6 h-6 text-muted-foreground" aria-hidden="true" />
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

/** Renders the right state block, or the children once data has arrived. */
export const SectionState = ({
  isLoading,
  isError,
  isEmpty,
  loadingLabel,
  errorLabel,
  emptyLabel,
  children,
}: {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  loadingLabel: string;
  errorLabel: string;
  emptyLabel: string;
  children: React.ReactNode;
}) => {
  if (isLoading) return <LoadingState label={loadingLabel} />;
  if (isError) return <ErrorState label={errorLabel} />;
  if (isEmpty) return <EmptyState label={emptyLabel} />;
  return <>{children}</>;
};
