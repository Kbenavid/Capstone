import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "PipeTrack",
  description: "Plumbing van inventory management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}