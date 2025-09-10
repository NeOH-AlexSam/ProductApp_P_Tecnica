

export default function AuthLayout({
 children
}: {
 children: React.ReactNode;
}) {
  return (
    <main className="flex justify-center">
      <div className="align-middle">
        {children}
      </div>
    </main>
  );
}