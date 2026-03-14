export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl items-center justify-center">
        {children}
      </div>
    </div>
  );
}