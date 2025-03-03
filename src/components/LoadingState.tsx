interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  className = ""
}: LoadingStateProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center min-h-screen w-full bg-gray-50">
      <div className={`text-center max-w-md w-full px-4 ${className}`}>
        <p className="text-xl">{message}</p>
      </div>
    </div>
  );
} 