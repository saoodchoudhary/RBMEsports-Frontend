import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "RBM ESports",
  description: "Skill-based BGMI tournaments"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}