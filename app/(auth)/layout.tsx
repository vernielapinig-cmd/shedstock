export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pegboard relative flex min-h-screen items-center justify-center overflow-hidden bg-primary p-6">
      <div className="pegboard-dark absolute inset-0" />
      <div className="relative z-10 w-full max-w-[400px] overflow-hidden rounded-[14px] bg-surface shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        {children}
      </div>
    </div>
  );
}
