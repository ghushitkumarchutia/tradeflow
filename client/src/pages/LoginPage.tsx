import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

import { isAxiosError } from "axios";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      if (isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Invalid credentials. Please try again.",
        );
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-bg-base flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden'>
        <div className='p-8 pb-6 bg-brand-dark text-white text-center'>
          <div className='w-12 h-12 bg-white/10 rounded-2xl mx-auto flex items-center justify-center mb-4'>
            <svg
              className='w-6 h-6 text-brand-light'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M13 10V3L4 14h7v7l9-11h-7z'
              />
            </svg>
          </div>
          <h2 className='text-2xl font-bold'>TradeFlow</h2>
          <p className='text-white/70 mt-1 text-sm'>Sign in to your account</p>
        </div>

        <div className='p-8'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
            {error && (
              <div className='p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center font-medium'>
                {error}
              </div>
            )}

            <Input
              label='Email Address'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='admin@tradeflow.com'
              required
            />

            <Input
              label='Password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='••••••••'
              required
            />

            <div className='pt-2'>
              <Button
                type='submit'
                fullWidth
                disabled={isSubmitting || !email || !password}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
