import Link from "next/link";
import Image from "next/image";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "RecriFlow - Register",
  description: "Create a new RecriFlow account.",
};

export default function RegisterPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 font-sans antialiased h-screen w-full overflow-hidden flex">
      <div className="hidden lg:block lg:w-1/2 h-full relative">
        <div className="absolute inset-0 z-0 h-full w-full">
          <Image
            alt="Abstract architectural rendering"
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        </div>
        <div className="relative z-10 h-full flex flex-col justify-between p-12 text-white">
          <div></div>
          <div className="max-w-md">
            <h2 className="text-3xl font-serif font-medium mb-4 italic">&quot;Transforming talent acquisition.&quot;</h2>
            <p className="text-sm text-white/80">
              Join thousands of recruiters who are scaling their hiring with our intelligent platform.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center bg-white dark:bg-background-dark relative overflow-y-auto">
        <div className="absolute top-8 left-8 sm:left-16 flex items-center gap-2">
          <span className="material-icons-outlined text-gray-900 dark:text-white text-2xl">auto_awesome</span>
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">RecriFlow</span>
        </div>
        <div className="w-full max-w-md mx-auto px-8 sm:px-16 py-12 mt-16 sm:mt-0">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">Create an account</h1>
            <p className="text-gray-500 dark:text-gray-400">Start optimizing your hiring pipeline today.</p>
          </div>
          <RegisterForm />
          <div className="mt-8 text-center pt-8 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?
              <Link className="font-semibold text-gray-900 dark:text-white hover:underline ml-1" href="/login">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
