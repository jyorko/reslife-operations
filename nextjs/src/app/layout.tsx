import "./globals.css";
import localFont from "next/font/local";
import Provider from "./Provider";

const alliance = localFont({
  src: [
    {
      path: "../../public/fonts/Alliance No.2 Regular.otf",
      weight: "400",
    },
  ],
  variable: "--font-alliance",
});

export const metadata = {
  title: "Residence Life Operations Administration Dashboard",
  description: "Student Staff Management.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={alliance.variable}>
        <main
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Provider>{children}</Provider>
        </main>
      </body>
    </html>
  );
}
