import React, { useState, useEffect } from 'react';
import {
  Lock,
  User as UserIcon,
  Calendar,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Phone,
  AtSign,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { PesikalamLogo } from './PesikalamLogo';
import { sounds } from '../utils/soundEffects';
import { User } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
  onRegisterUser: (newUser: User) => boolean;
  registeredUsers: User[];
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  onRegisterUser,
  registeredUsers,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Sign Up Form States
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [username, setUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & Feedback Messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // 60-Second Resend Countdown Timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Clean values
  const cleanPhone = phone.replace(/\D/g, '');
  const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

  // Live Uniqueness Check for Username
  const isUsernameTaken =
    cleanUsername.length >= 3 &&
    registeredUsers.some((u) => u.username.toLowerCase() === cleanUsername);
  const isUsernameAvailable = cleanUsername.length >= 3 && !isUsernameTaken;

  // Strict Phone Constraint: Maximum 5 accounts per phone number
  const accountsUnderPhone = registeredUsers.filter(
    (u) => u.phone && u.phone.replace(/\D/g, '') === cleanPhone
  ).length;
  const isPhoneLimitReached = cleanPhone.length === 10 && accountsUnderPhone >= 5;

  // Advanced Password Validation: Min 8 chars, mandatory numeric digit [0-9]
  const hasMinLength = signupPassword.length >= 8;
  const hasNumber = /\d/.test(signupPassword);
  const isSignupPasswordValid = hasMinLength && hasNumber;

  // Real-time password strength evaluator
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-700', text: 'text-slate-500' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/\d/.test(pass)) score++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass) || pass.length >= 12) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-400' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-cyan-500', text: 'text-cyan-400' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400' };
  };

  const strength = calculatePasswordStrength(signupPassword);

  // Trigger Backend Real SMS OTP Service
  const handleSendOtp = async () => {
    if (cleanPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (isPhoneLimitReached) {
      setErrorMessage('Maximum 5 accounts limit reached for this phone number.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setIsSendingOtp(true);
    sounds.playPop();

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          existingAccountCount: accountsUnderPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || 'Failed to dispatch SMS. Please try again.');
        if (data.cooldownSeconds) setResendCooldown(data.cooldownSeconds);
        return;
      }

      setOtpSent(true);
      setResendCooldown(data.cooldownSeconds || 60);
      setSuccessMessage(`SMS OTP sent to +91 ${cleanPhone}. Please check your phone.`);
    } catch {
      setErrorMessage('Network connection error while contacting SMS gateway.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify 6-Digit OTP via Backend
  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.trim().length !== 6) {
      setErrorMessage('Please enter the complete 6-digit code sent to your phone.');
      return;
    }

    setErrorMessage('');
    setIsVerifyingOtp(true);
    sounds.playPop();

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          otp: otp.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || 'Invalid verification code. Please check your SMS.');
        return;
      }

      setIsPhoneVerified(true);
      setVerificationToken(data.verificationToken || 'verified');
      setSuccessMessage('Mobile number verified successfully.');
      sounds.playLike();
    } catch {
      setErrorMessage('Verification failed. Please try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Sign Up Submission
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!dob) {
      setErrorMessage('Please select your Date of Birth.');
      return;
    }
    if (cleanPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (isPhoneLimitReached) {
      setErrorMessage('Maximum 5 accounts limit reached for this phone number.');
      return;
    }
    if (!isPhoneVerified) {
      setErrorMessage('Please verify your phone number via 6-digit SMS OTP first.');
      return;
    }
    if (cleanUsername.length < 3) {
      setErrorMessage('Username must be at least 3 characters long.');
      return;
    }
    if (isUsernameTaken) {
      setErrorMessage(`@${cleanUsername} is already taken. Please choose another.`);
      return;
    }
    if (!isSignupPasswordValid) {
      setErrorMessage('Must be at least 8 characters long and include at least one number');
      return;
    }

    setIsSubmitting(true);
    sounds.playLike();

    setTimeout(async () => {
      setIsSubmitting(false);
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: fullName.trim(),
        username: cleanUsername,
        phone: cleanPhone,
        password: signupPassword,
        dob,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        bio: 'Joined Pesikalam • Namma Vibe, Namma Chat ✨',
        location: 'Chennai, Tamil Nadu',
        isVerified: false,
        isOnline: true,
        postsCount: 0,
        followersCount: 0,
        followingCount: 0,
        highlights: [],
      };

      const success = onRegisterUser(newUser);
      if (success) {
        // Trigger automated Device Login Alert for new registration
        try {
          const userAgent = navigator.userAgent;
          const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
          await fetch('/api/auth/device-login-alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: newUser.username,
              phone: newUser.phone,
              deviceDetails: {
                deviceModel: isMobile ? 'Mobile Smartphone' : 'Desktop Browser',
                browser: userAgent.includes('Chrome') ? 'Google Chrome' : userAgent.includes('Safari') ? 'Apple Safari' : 'Web Browser',
                os: isMobile ? 'Android / iOS' : 'Desktop OS',
                location: 'Chennai, Tamil Nadu',
              },
            }),
          });
        } catch {
          // ignore
        }
        onLoginSuccess(newUser);
      } else {
        setErrorMessage('Failed to create account. Username already exists.');
      }
    }, 400);
  };

  // Login Submission (Strict Credential Verification)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanInput = loginIdentifier.trim().toLowerCase().replace(/^@/, '');
    const cleanDigits = loginIdentifier.replace(/\D/g, '');

    if (!cleanInput) {
      setErrorMessage('Please enter your registered username or phone number.');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    sounds.playPop();

    setTimeout(async () => {
      setIsSubmitting(false);

      const matchedUser = registeredUsers.find((u) => {
        const matchesUsername = u.username.toLowerCase() === cleanInput;
        const matchesPhone = cleanDigits.length >= 10 && u.phone && u.phone.replace(/\D/g, '') === cleanDigits;
        return matchesUsername || matchesPhone;
      });

      if (!matchedUser || (matchedUser.password && matchedUser.password !== loginPassword)) {
        setErrorMessage('Invalid Username or Password.');
        return;
      }

      // Trigger automated Security SMS / Email notification for new device login
      try {
        const userAgent = navigator.userAgent;
        const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
        await fetch('/api/auth/device-login-alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: matchedUser.username,
            phone: matchedUser.phone,
            deviceDetails: {
              deviceModel: isMobile ? 'Mobile Smartphone' : 'Desktop Browser',
              browser: userAgent.includes('Chrome') ? 'Google Chrome' : userAgent.includes('Safari') ? 'Apple Safari' : 'Web Browser',
              os: isMobile ? 'Android / iOS' : 'Desktop OS',
              location: 'Chennai, Tamil Nadu',
            },
          }),
        });
      } catch {
        // ignore
      }

      sounds.playLike();
      onLoginSuccess(matchedUser);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#090b10] via-[#0d1117] to-[#120e1e] flex flex-col justify-center items-center p-3 sm:p-4 relative overflow-hidden">
      {/* Background neon ambient lights */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[420px] z-10 py-4">
        {/* Brand Header with Official Pesikalam Logo */}
        <div className="flex flex-col items-center text-center mb-3">
          <PesikalamLogo size={120} />
          <p className="text-xs uppercase tracking-widest text-cyan-400 font-extrabold mt-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            Namma Vibe, Namma Chat
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#121622]/90 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-black/80">
          {/* Tab Selector: Log In vs Create Account */}
          <div className="flex bg-[#0b0e14] p-1 rounded-2xl border border-slate-800/80 mb-4">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage('');
                setSuccessMessage('');
                sounds.playPop();
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                authMode === 'login'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setErrorMessage('');
                setSuccessMessage('');
                sounds.playPop();
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Banners */}
          {successMessage && (
            <div className="mb-3.5 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-3.5 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-shake">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Content */}
          {authMode === 'signup' ? (
            /* CREATE ACCOUNT FORM */
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              {/* 1. Full Name */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#0d1017] border border-slate-700/80 focus:border-purple-400 rounded-xl py-2 pl-10 pr-3.5 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                </div>
              </div>

              {/* 2. Date of Birth (DOB) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 ml-1">
                  Date of Birth (DOB)
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    required
                    max="2016-12-31"
                    min="1940-01-01"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-[#0d1017] border border-slate-700/80 focus:border-purple-400 rounded-xl py-2 pl-10 pr-3.5 text-xs text-white placeholder-slate-500 outline-none transition scheme-dark"
                  />
                </div>
              </div>

              {/* 3. Phone Number & Live SMS OTP Verification */}
              <div>
                <div className="flex items-center justify-between mb-1 ml-1 mr-1">
                  <label className="text-[11px] font-semibold text-slate-300">
                    Mobile Number (SMS Verification)
                  </label>
                  {cleanPhone.length === 10 && (
                    <span
                      className={`text-[10px] font-bold ${
                        isPhoneLimitReached ? 'text-rose-400' : 'text-slate-400'
                      }`}
                    >
                      {accountsUnderPhone}/5 accounts
                    </span>
                  )}
                </div>

                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-cyan-400 pl-0.5 pr-2 border-r border-slate-700">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    disabled={isPhoneVerified}
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setOtpSent(false);
                      setIsPhoneVerified(false);
                      setVerificationToken(null);
                    }}
                    className={`w-full bg-[#0d1017] border rounded-xl py-2 pl-14 pr-24 text-xs text-white placeholder-slate-500 outline-none transition tracking-wide ${
                      isPhoneVerified
                        ? 'border-emerald-500/80 bg-emerald-950/10'
                        : isPhoneLimitReached
                        ? 'border-rose-500'
                        : 'border-slate-700/80 focus:border-cyan-400'
                    }`}
                  />
                  {!isPhoneVerified ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={
                        cleanPhone.length !== 10 ||
                        isPhoneLimitReached ||
                        isSendingOtp ||
                        resendCooldown > 0
                      }
                      className="absolute right-1.5 px-2.5 py-1 text-[10px] font-bold rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30 transition disabled:opacity-40 cursor-pointer"
                    >
                      {isSendingOtp ? (
                        'Sending...'
                      ) : resendCooldown > 0 ? (
                        `Resend (${resendCooldown}s)`
                      ) : otpSent ? (
                        'Resend OTP'
                      ) : (
                        'Send OTP'
                      )}
                    </button>
                  ) : (
                    <div className="absolute right-2.5 flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 6-Digit OTP Input & Verification Row */}
              {otpSent && !isPhoneVerified && (
                <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-cyan-300 font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      Enter 6-Digit SMS Code
                    </span>
                    {resendCooldown > 0 && (
                      <span className="text-[10px] font-mono text-slate-400">
                        Resend in {resendCooldown}s
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="••••••"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="flex-1 bg-[#0d1017] border border-cyan-500/40 focus:border-cyan-400 rounded-xl py-1.5 px-3 text-center text-sm font-bold tracking-widest text-cyan-200 placeholder-slate-600 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otp.length !== 6 || isVerifyingOtp}
                      className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-40 cursor-pointer"
                    >
                      {isVerifyingOtp ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>
                </div>
              )}

              {/* 4. Unique Username with Live Constraint Checker */}
              <div>
                <div className="flex items-center justify-between mb-1 ml-1 mr-1">
                  <label className="text-[11px] font-semibold text-slate-300">
                    Unique Username
                  </label>
                  {cleanUsername.length >= 3 && (
                    <span
                      className={`text-[10px] font-bold flex items-center gap-1 ${
                        isUsernameAvailable ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isUsernameAvailable ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Available
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Taken
                        </>
                      )}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <AtSign className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Choose unique username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full bg-[#0d1017] border rounded-xl py-2 pl-10 pr-10 text-xs text-white placeholder-slate-500 outline-none transition ${
                      cleanUsername.length >= 3
                        ? isUsernameAvailable
                          ? 'border-emerald-500/80 focus:border-emerald-400'
                          : 'border-rose-500/80 focus:border-rose-400'
                        : 'border-slate-700/80 focus:border-purple-400'
                    }`}
                  />
                </div>
              </div>

              {/* 5. Password: Min 8 chars with mandatory number, live strength bar & eye toggle */}
              <div>
                <div className="flex items-center justify-between mb-1 ml-1 mr-1">
                  <label className="text-[11px] font-semibold text-slate-300">
                    Password
                  </label>
                  {signupPassword.length > 0 && (
                    <span className={`text-[10px] font-bold ${strength.text}`}>
                      {strength.label} Strength
                    </span>
                  )}
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter strong password (e.g. Vibe2026!)"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className={`w-full bg-[#0d1017] border rounded-xl py-2 pl-10 pr-10 text-xs text-white placeholder-slate-500 outline-none transition ${
                      signupPassword.length > 0
                        ? isSignupPasswordValid
                          ? 'border-emerald-500/80 focus:border-emerald-400'
                          : 'border-amber-500/80 focus:border-amber-400'
                        : 'border-slate-700/80 focus:border-purple-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showSignupPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Real-time Password Strength Meter Bar */}
                {signupPassword.length > 0 && (
                  <div className="mt-1.5 space-y-1">
                    <div className="flex items-center gap-1 h-1 w-full bg-slate-800 rounded-full overflow-hidden p-[1px]">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-full flex-1 rounded-full transition-all duration-300 ${
                            strength.score >= step ? strength.color : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Live Validation Rules Chips */}
                    <div className="flex items-center gap-2 pt-0.5">
                      <span
                        className={`text-[10px] font-bold flex items-center gap-1 ${
                          hasMinLength ? 'text-emerald-400' : 'text-slate-400'
                        }`}
                      >
                        {hasMinLength ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 inline-block" />
                        )}
                        8+ characters
                      </span>

                      <span
                        className={`text-[10px] font-bold flex items-center gap-1 ${
                          hasNumber ? 'text-emerald-400' : 'text-slate-400'
                        }`}
                      >
                        {hasNumber ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 inline-block" />
                        )}
                        At least 1 number (0-9)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Sign Up Button */}
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  isUsernameTaken ||
                  !isSignupPasswordValid ||
                  isPhoneLimitReached ||
                  !isPhoneVerified
                }
                className="w-full mt-2 py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:opacity-95 active:scale-[0.98] transition shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* LOG IN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              {/* Username or Phone Number */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 ml-1">
                  Registered Username or Mobile Number
                </label>
                <div className="relative">
                  <AtSign className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Username or 10-digit mobile number"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full bg-[#0d1017] border border-slate-700/80 focus:border-cyan-400 rounded-xl py-2 pl-10 pr-3.5 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1 ml-1 mr-1">
                  <label className="text-[11px] font-semibold text-slate-300">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    maxLength={8}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[#0d1017] border border-slate-700/80 focus:border-cyan-400 rounded-xl py-2 pl-10 pr-10 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-0.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 w-3.5 h-3.5"
                  />
                  Remember me
                </label>
              </div>

              {/* Submit Log In */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:opacity-95 active:scale-[0.98] transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Log In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Clean Footer Info */}
        <p className="text-center text-[10px] text-slate-500 mt-4">
          Pesikalam • Secure Mobile Verification
        </p>
      </div>
    </div>
  );
};
