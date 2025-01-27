import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
    <Navbar /> {/* Top block: Navbar */}
    
    <main className="bg-[#1F2433] flex-grow h-full flex items-center justify-center">
      {children} {/* Middle block: Takes full height and centers its content */}
    </main>
    
    <Footer /> {/* Bottom block: Always at the bottom */}
  </div>
  );
}
