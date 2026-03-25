import MediAssistChatbot from "@/components/MediAssistChatbot";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}
        <MediAssistChatbot></MediAssistChatbot>
      </body>
    </html>
  );
}
