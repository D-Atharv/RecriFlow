import Link from "next/link";

export function Navbar() {
    return (
        <nav className="fixed w-full z-50 transition-all duration-300 bg-white/80  backdrop-blur-md border-b border-gray-100 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <span className="material-icons-outlined text-gray-900 ">auto_awesome</span>
                        <span className="font-bold text-xl tracking-tight">RecriFlow</span>
                    </div>
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link className="text-sm font-medium text-gray-600  hover:text-gray-900 :text-white transition" href="#">Product</Link>
                        <Link className="text-sm font-medium text-gray-600  hover:text-gray-900 :text-white transition" href="#">Solutions</Link>
                        <Link className="text-sm font-medium text-gray-600  hover:text-gray-900 :text-white transition" href="#">Company</Link>
                        <Link className="text-sm font-medium text-gray-600  hover:text-gray-900 :text-white transition" href="#">Resources</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link className="text-sm font-medium text-gray-900  hover:opacity-70" href="/login">Log in</Link>
                        <Link className="bg-primary hover:bg-gray-800   :bg-gray-200 text-white px-4 py-2 rounded-full text-sm font-medium transition shadow-md" href="#">Get demo</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
