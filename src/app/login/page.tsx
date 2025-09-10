"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner/index";
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import Login from "./Login";
import Register from "./Register";
import { signIn, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AuthPage() {
  const [currentView, setCurrentView] = useState<'main' | 'login' | 'register'>('main');
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace("/dashboard");
    }
  }, [session, isPending, router]);

  // Show loading while checking session
  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-gray-900">Loading...</div>
      </div>
    )
  }

  // Don't render if user is authenticated (will redirect)
  if (session?.user) {
    return null
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn.social({ provider: "google" });
      toast.success("Connecting with Google...");
    } catch (error) {
      toast.error("Failed to connect with Google. Please try again.");
      console.error("Google login error:", error);
      setIsGoogleLoading(false);
    }
  };

  const handleEmailLogin = () => {
    setIsEmailLoading(true);
    setCurrentView('login');
    // Reset loading state after view change
    setTimeout(() => setIsEmailLoading(false), 100);
  };

  const handleRegister = () => {
    setCurrentView('register');
  };

  const handleBack = () => {
    setCurrentView('main');
  };

  const handleLoginClick = () => {
    setCurrentView('login');
  };

  if (currentView === 'login') {
    return <Login onBack={handleBack} onRegisterClick={handleRegister} />;
  }

  if (currentView === 'register') {
    return <Register onBack={handleBack} onLoginClick={handleLoginClick} />;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-sm w-96 text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">Continue with an account</h1>
          <p className="text-gray-600 text-sm">You must log in or register to continue.</p>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            variant="outline" 
            className="w-full h-10 border-0 border-t-2 border-gray-300 bg-white hover:bg-gray-50 rounded-full cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center justify-center gap-3">
              <FcGoogle size={20} />
              <span className="text-gray-700 font-medium">
                {isGoogleLoading ? "Connecting..." : "Continue with Google"}
              </span>
            </div>
          </Button>
          
          <Button 
            onClick={handleEmailLogin}
            disabled={isEmailLoading}
            className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer rounded-full disabled:opacity-50"
          >
            <div className="flex items-center justify-center gap-5">
              {isEmailLoading && <Spinner className="w-4 h-4" />}
              <MdEmail size={20} color="white"/>
              <span className="text-white font-medium">
                {isEmailLoading ? "Loading..." : "Login with Email"}
              </span>
            </div>
          </Button>
        </div>
        
        <div className="pt-4">
          <button 
            onClick={handleRegister}
            className="text-gray-600 underline text-sm hover:text-gray-700 font-semibold cursor-pointer"
          >
            New User? Create New Account
          </button>
        </div>
        
        <div className="text-xs text-gray-600 pt-2">
          By continuing, you agree to our{" "}
          <button className="underline hover:text-gray-700">Privacy Policy</button>
          {" "}and{" "}
          <button className="underline hover:text-gray-700">T&Cs</button>
        </div>
      </div>
    </div>
  );
}
