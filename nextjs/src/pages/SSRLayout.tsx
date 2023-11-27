import "../app/globals.css";
import Provider from "../app/Provider";
import localFont from "next/font/local";

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
  description: "Defining surveillance portability.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: "100vh",
      }}
      className={alliance.variable}
    >
      <Provider>{children}</Provider>
    </main>
  );
}
