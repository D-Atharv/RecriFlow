import { NotFoundIllustration } from "@/components/ui/not-found/not-found-illustration";
import { NotFoundContent } from "@/components/ui/not-found/not-found-content";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background-light py-6 dark:bg-slate-950">
            <main className="container mx-auto flex max-w-xl flex-col items-center justify-center px-4">
                {/* Illustration Area */}
                <div className="mb-4">
                    <NotFoundIllustration />
                </div>

                {/* Text and Actions Area */}
                <div>
                    <NotFoundContent />
                </div>
            </main>

            {/* Subtle branding footer */}
            <footer className="mt-12 flex flex-col items-center gap-4 text-center">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-300">
                    © {new Date().getFullYear()} RecriFlow Inc.
                </p>
            </footer>
        </div>
    );
}
