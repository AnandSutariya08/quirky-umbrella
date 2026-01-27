'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

const AdminLoginInteractive = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = () => {
      // Use both localStorage and cookies for robust auth checking
      const localStorageAuth = localStorage.getItem('adminAuthenticated') === 'true';
      const cookieAuth = document.cookie.split('; ').find(row => row.startsWith('adminAuthenticated='))?.split('=')[1] === 'true';
      
      if (localStorageAuth || cookieAuth) {
        // If one is missing but the other exists, sync them
        if (!cookieAuth && localStorageAuth) {
          document.cookie = `adminAuthenticated=true; path=/; max-age=86400`;
        }
        if (!localStorageAuth && cookieAuth) {
          localStorage.setItem('adminAuthenticated', 'true');
        }
        
        router.replace('/admin-services-management');
      } else {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-warm-lg p-8">
          <div className="flex flex-col items-center py-12">
            <Icon
              name="ArrowPathIcon"
              size={48}
              className="text-primary mx-auto mb-4 animate-spin"
            />
            <p className="text-muted-foreground">Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (username === 'admin' && password === '123') {
      // Set authentication flag in localStorage
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminLoginTime', Date.now().toString());
      document.cookie = `adminAuthenticated=true; path=/; max-age=86400`;
      // Redirect to admin dashboard
      router.push('/admin-services-management');
    } else {
      setError('Invalid username or password');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-card border border-border rounded-lg shadow-warm-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/assets/images/ImageToStl.com_QU_Logo-1768912371539.png"
            alt="Quirky Umbrella Logo"
            className="h-16 w-auto mb-6"
          />
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Login</h1>
          <p className="text-muted-foreground text-center">
            Enter your credentials to access the admin panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="UserIcon" size={20} className="text-muted-foreground" />
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                placeholder="Enter username"
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="LockClosedIcon" size={20} className="text-muted-foreground" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                placeholder="Enter password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-smooth"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={20} />
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              <Icon name="ExclamationCircleIcon" size={20} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium transition-smooth hover:shadow-warm-md hover:-translate-y-0.5 press-scale disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginInteractive;
