export const metadata = {
  title: "TEST API",
  description: "API tester",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <h1>Layout Test</h1>
    </>
  );
}
