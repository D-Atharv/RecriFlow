import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "RecriFlow - Login",
  description: "Sign in to your RecriFlow account.",
};

export default function LoginPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 font-sans antialiased h-screen w-full overflow-hidden flex">
      <div className="hidden lg:block lg:w-1/2 h-full relative">
        <div className="absolute inset-0 z-0 h-full w-full">
          <Image
            alt="Serene mountain landscape"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiN5TOYHhWwLiScRKzy-juKyOCYRczkUqLgIk_AYQSOrUL5XlD1dXBfSevaFwjv09vJtupANnyxs7bLNJlPvKGjLB-PRuOt-o1cN4YjSMIPiMf6r_rCyBF6j3Ac2_GOHFEGENT8eAPDLLElSIsLlhpbDvIOJJd5YJ0vUFQsXbGZYJLgORtb571CJ1gkKP7ZOBaBs1eQGa6OTGAJqG-i2qYSFwaey8ZIF5RuQhi1eFj--kGbQ2zZVBJe8nmjv4jfh8L0VABdUv4Eag"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        </div>
        <div className="relative z-10 h-full flex flex-col justify-between p-12 text-white">
          <div></div>
          <div className="max-w-md">
            <h2 className="text-3xl font-serif font-medium mb-4 italic">&quot;The new standard in hiring.&quot;</h2>
            <p className="text-sm text-white/80">
              Streamline your recruitment process with AI-powered insights and automated workflows.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center bg-white dark:bg-background-dark relative overflow-y-auto">
        <div className="absolute top-8 left-8 sm:left-16 flex items-center gap-2">
          <span className="material-icons-outlined text-gray-900 dark:text-white text-2xl">auto_awesome</span>
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">RecriFlow</span>
        </div>
        <div className="w-full max-w-md mx-auto px-8 sm:px-16 py-12">
          <div className="mb-10">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">Welcome back</h1>
            <p className="text-gray-500 dark:text-gray-400">Please enter your details to sign in.</p>
          </div>
          <LoginForm />
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don&apos;t have an account?
              <Link className="font-semibold text-gray-900 dark:text-white hover:underline ml-1" href="/register">
                Register
              </Link>
            </p>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
              By logging in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
