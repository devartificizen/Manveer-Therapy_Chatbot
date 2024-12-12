import type { Metadata } from "next";
import "./globals.css";
import Provider from "./context/Provider";


export const metadata: Metadata = {
  title: "Mental health chatbot",
  description: "A chatbot that helps you with your mental health",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
       <Provider>{children}</Provider>
      </body>
    </html>
  );
}
