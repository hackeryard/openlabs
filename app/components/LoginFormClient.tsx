import { useSearchParams } from "next/navigation";

export function LoginFormClient({ children }: { children: (nextPath: string) => React.ReactNode }) {
  const searchParams = useSearchParams();
  const nextPath = searchParams?.get("next") || "/";
  
  return <>{children(nextPath)}</>;
}
