import Image from "next/image";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="relative bg-teal-900 text-white overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-[400px] z-0">
                <Image
                    alt="Lush landscape footer"
                    className="w-full h-full object-cover object-bottom opacity-80"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7euVu1UjtLMGBMOx2uAOS9gVMuraPPUXkEGd7GNtxTk_dIxgwc8xrELVfGhUsR_4g-h62oL-7803FhU-bcQ0p4v74p0w07kLBIsnxv_GH3W4ELcKwwoBsGwIDkhh7FnlLpeie3rpU6H2dByould7y673G4LxzpNXj6hCIr__sLMgo8k0PrBzK0xlX2oibrFC4u2Bz2mqQbwyxpm0knoorpkan2ajNveRyq8LZqJvwA3Lvtsb684OFrFtfC1oLmCsX-ZgF4EscFUE"
                    fill
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/10 to-teal-900"></div>
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-32">
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 pb-8 border-b border-white/10">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <span className="material-icons-outlined text-white">auto_awesome</span>
                        <span className="font-bold text-xl tracking-tight">RecriFlow</span>
                    </div>
                    <div className="flex flex-wrap gap-8 text-xs font-medium text-teal-100">
                        <Link className="hover:text-white transition" href="#">Product</Link>
                        <Link className="hover:text-white transition" href="#">Customers</Link>
                        <Link className="hover:text-white transition" href="#">Company</Link>
                        <Link className="hover:text-white transition" href="#">Resources</Link>
                    </div>
                    <button className="bg-black text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-gray-900 transition mt-4 md:mt-0">
                        Schedule a demo
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-24 text-xs text-teal-100/80">
                    <div>
                        <h4 className="font-bold text-white mb-4">Product</h4>
                        <ul className="space-y-2">
                            <li><Link className="hover:text-white" href="#">Onboard</Link></li>
                            <li><Link className="hover:text-white" href="#">Decide</Link></li>
                            <li><Link className="hover:text-white" href="#">Lifecycle</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Platform</h4>
                        <ul className="space-y-2">
                            <li><Link className="hover:text-white" href="#">RecriFlow AI</Link></li>
                            <li><Link className="hover:text-white" href="#">Policy engine</Link></li>
                            <li><Link className="hover:text-white" href="#">Data platform</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Industries</h4>
                        <ul className="space-y-2">
                            <li><Link className="hover:text-white" href="#">Financial technology</Link></li>
                            <li><Link className="hover:text-white" href="#">Banking</Link></li>
                            <li><Link className="hover:text-white" href="#">Platforms</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Customers</h4>
                        <ul className="space-y-2">
                            <li><Link className="hover:text-white" href="#">Compliance</Link></li>
                            <li><Link className="hover:text-white" href="#">Revenue</Link></li>
                            <li><Link className="hover:text-white" href="#">Technology</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li><Link className="hover:text-white" href="#">About</Link></li>
                            <li><Link className="hover:text-white" href="#">News</Link></li>
                            <li><Link className="hover:text-white" href="#">Careers</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center text-[10px] text-teal-100/60">
                    <div className="mb-2 md:mb-0">© RecriFlow 2024</div>
                    <div className="flex gap-4">
                        <Link className="hover:text-white" href="#">Privacy Policy</Link>
                        <Link className="hover:text-white" href="#">Security</Link>
                    </div>
                </div>
            </div>
            <div className="fixed bottom-4 right-4 z-50 bg-white text-gray-900 p-4 rounded-lg shadow-2xl max-w-sm flex items-center justify-between gap-4 text-xs animate-fade-in-up">
                <p>We use cookies to personalize content. <Link className="underline" href="#">Learn more</Link>.</p>
                <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded font-bold">Okay</button>
            </div>
        </footer>
    );
}
