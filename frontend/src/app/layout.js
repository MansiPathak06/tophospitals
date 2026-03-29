import MediAssistChatbot from "@/components/MediAssistChatbot";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Navbar/>
        {children}
        <Footer/>
        <MediAssistChatbot></MediAssistChatbot>
      </body>
    </html>
  );
}
