// app/layout.jsx
import "./globals.css";
import NavBar from "./components/NavBar";

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