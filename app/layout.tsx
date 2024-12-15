import type { Metadata } from "next";
import "./globals.css";
import Provider from "./context/Provider";
import { MusicProvider } from "./context/MusicContext";
import Music from "./components/Music";

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
      <body>
        <Provider>
          <MusicProvider>
            {children}
            <Music />
          </MusicProvider>
        </Provider>
      </body>
    </html>
  );
}
