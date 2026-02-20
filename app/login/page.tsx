import { Suspense } from "react";
import dynamic from "next/dynamic";

const LoginFormWithParams = dynamic(() => import("@/app/components/LoginFormWithParams"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mb-4 w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-600">Loading...</p>
      </div>
    </div>
  ),
  ssr: false,
});

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mb-4 w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginFormWithParams />
    </Suspense>
  );
}
