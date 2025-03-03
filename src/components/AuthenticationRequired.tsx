import { SignInButton } from './SignInButton'

interface AuthenticationRequiredProps {
  title?: string;
  description?: string;
  className?: string;
}

export function AuthenticationRequired({
  title = "Welcome to Food Planner",
  description = "Please sign in to continue.",
  className = ""
}: AuthenticationRequiredProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center min-h-screen w-full bg-gray-50">
      <div className={`text-center max-w-md w-full px-4 ${className}`}>
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <p className="mb-4">{description}</p>
        <SignInButton />
      </div>
    </div>
  );
} 