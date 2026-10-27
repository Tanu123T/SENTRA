import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { authApi } from '../../api/auth.api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Lock, Mail, Eye, EyeOff, ShieldAlert, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setTokens, fetchProfile } = useAuthStore();

  const [email, setEmail] = useState('admin@sentra.gov.in');
  const [password, setPassword] = useState('AdminSecurePassword123!');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.login(email.trim(), password);
      setTokens(response.access_token, response.refresh_token);
      await fetchProfile();
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        setErrorMessage('Invalid credentials. Please verify your email and password.');
      } else if (err.response?.status === 429) {
        setErrorMessage('Too many login attempts. Account temporarily locked for 15 minutes.');
      } else if (err.code === 'ERR_NETWORK') {
        setErrorMessage('Unable to connect to SENTRA backend. Ensure backend is running at http://127.0.0.1:8000.');
      } else {
        setErrorMessage(err.response?.data?.error?.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#080D13] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background Topographic Radar Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#243342_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none -top-40 -left-40" />

      {/* Main Login Card */}
      <div className="relative w-full max-w-md bg-[#0D151E] border border-[#243342] rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur z-10">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 flex items-center justify-center p-2 shadow-lg mb-1">
            <img src="/sentra-radar.svg" alt="SENTRA Radar" className="w-full h-full" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#E8EEF5]">
            SENTRA COMMAND
          </h1>
          <p className="text-xs text-[#91A0B3] max-w-xs">
            Disaster Intelligence, Resource Optimization & Regional Early Warning Platform
          </p>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-400">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Operator Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="officer@sentra.gov.in"
            leftIcon={<Mail className="w-4 h-4" />}
            required
            autoComplete="email"
          />

          <Input
            label="Security Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#91A0B3] hover:text-[#E8EEF5] focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            required
            autoComplete="current-password"
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Command Center
            </Button>
          </div>
        </form>

        {/* Credentials reminder */}
        <div className="mt-6 pt-5 border-t border-[#243342]/70 text-center">
          <p className="text-[11px] text-[#5A6E85]">
            Authorized Indian Emergency Response & Disaster Management Personnel Only.
          </p>
        </div>
      </div>
    </div>
  );
};
