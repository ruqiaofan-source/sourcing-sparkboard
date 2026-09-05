import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, User, Phone, MapPin, Package, Globe, Shield } from "lucide-react";
import equilinqLogo from "@/assets/equilinq-logo.webp";
import equilinqLogoWhite from "@/assets/equilinq-logo-white-optimized.webp";

const loginGreetings = [
  "Welcome back",
  "Look who's back",
  "Oh hey, you again",
  "Back for more?",
  "Missed you already",
  "The return of the legend",
  "You're back. Factories rejoice",
  "Ready to source some magic?",
  "Long time no source",
  "Your factories missed you",
  "Let's get this bread",
  "Supply chain hero returns",
  "Back in the sourcing saddle",
  "The sequel is always better",
  "Plot twist: you're back",
];

const getRandomGreeting = () =>
  loginGreetings[Math.floor(Math.random() * loginGreetings.length)];

const features = [
  { icon: Package, label: "Verified Factories", desc: "Direct access to vetted manufacturers" },
  { icon: Globe, label: "End-to-End Logistics", desc: "Shipping, customs & delivery handled" },
  { icon: Shield, label: "Quality Guaranteed", desc: "Multi-stage inspection process" },
];

const AuthPage = () => {
  const [greeting] = useState(getRandomGreeting);
  const [searchParams] = useSearchParams();
  const rawNext = searchParams.get("next");
  const nextPath = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : null;
  const postAuthUrl = `${window.location.origin}${nextPath ?? "/dashboard"}`;
  const [isSignUp, setIsSignUp] = useState(searchParams.get("signup") === "true");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailSentType, setEmailSentType] = useState<"signup" | "reset">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [areaOfResidence, setAreaOfResidence] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setEmailSentType("reset");
        setEmailSent(true);
      } else if (isSignUp) {
        if (password !== confirmPassword) {
          toast({ title: "Passwords don't match", description: "Please make sure both passwords are identical.", variant: "destructive" });
          setLoading(false);
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: postAuthUrl,
            data: {
              full_name: fullName,
              phone_number: phone,
              area_of_residence: areaOfResidence,
              delivery_address: deliveryAddress,
            },
          },
        });
        if (error) throw error;

        // Notify admin of new signup (fire-and-forget)
        try {
          const newUserId = data.user?.id || email;
          await supabase.functions.invoke("send-transactional-email", {
            body: {
              templateName: "admin-notification",
              recipientEmail: "admin@equilinq.eu",
              idempotencyKey: `admin-new-signup-${newUserId}`,
              templateData: {
                eventType: "new_signup",
                title: "New customer registered",
                summary: `${fullName || email} just signed up on Equilinq.`,
                details: {
                  Name: fullName,
                  Email: email,
                  Phone: phone,
                  Area: areaOfResidence,
                  Address: deliveryAddress,
                },
                link: `${window.location.origin}/admin/users`,
              },
            },
          });
        } catch (notifyErr) {
          console.error("Failed to send admin signup notification:", notifyErr);
        }

        setEmailSentType("signup");
        setEmailSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: postAuthUrl,
      });
      if (result.error) {
        toast({ title: "Error", description: result.error.message, variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      <SEOHead title="Sign In - Equilinq Sourcing Platform" description="Sign in or create your Equilinq account. Access verified Chinese manufacturers, transparent pricing, and end-to-end sourcing." noindex />
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--glow-blue)" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--glow-streak)" }} />
      <div className="absolute inset-0 pointer-events-none opacity-50" style={{ background: "var(--glow-blue-bottom)" }} />

      {/* Left panel - branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-between p-12 xl:p-16">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src={equilinqLogoWhite} alt="Equilinq" className="h-10 w-10 rounded-lg object-cover" />
              <span className="font-heading text-xl font-bold text-white tracking-wider uppercase">
                Equilinq
              </span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="font-heading text-4xl xl:text-5xl font-bold text-foreground leading-tight mb-4">
              Source smarter
              <br />
              <span className="text-primary">from China.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
              Transparent pricing, verified factories, and end-to-end logistics for European SMEs.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-4 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm px-5 py-4"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{f.label}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src={equilinqLogoWhite} alt="Equilinq" className="h-10 w-10 object-cover" />
              <h1 className="font-heading text-2xl font-bold text-foreground tracking-wider uppercase">
                Equilinq
              </h1>
            </Link>
          </div>

          {emailSent ? (
            /* Email sent confirmation screen */
            <motion.div
              key="email-sent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-8 sm:p-10 shadow-[var(--shadow-glow)]">
                <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                  {emailSentType === "signup" ? "Check your inbox" : "Reset link sent"}
                </h2>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {emailSentType === "signup"
                    ? <>We've sent a confirmation link to <span className="text-foreground font-medium">{email}</span>. Click the link in the email to verify your account and get started.</>
                    : <>We've sent a password reset link to <span className="text-foreground font-medium">{email}</span>. Check your email and follow the instructions.</>
                  }
                </p>
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Didn't receive it? Check your spam folder or try again.
                  </p>
                  <Button
                    variant="outline"
                    className="rounded-full border-border"
                    onClick={() => {
                      setEmailSent(false);
                      setIsForgotPassword(false);
                      setIsSignUp(false);
                      setPassword("");
                    }}
                  >
                    <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                    Back to sign in
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Login / Signup / Forgot password form */
            <>
              <div className="mb-6">
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  {isForgotPassword ? "Reset password" : isSignUp ? "Create account" : greeting}
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {isForgotPassword
                    ? "Enter your email to receive a reset link"
                    : isSignUp
                    ? "Set up your customer account to get started"
                    : "Sign in to manage your sourcing requests"}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 sm:p-8 shadow-[var(--shadow-glow)]">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <AnimatePresence mode="wait">
                    {isSignUp && !isForgotPassword && (
                      <motion.div
                        key="signup-fields"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 overflow-hidden"
                      >
                        <div className="space-y-1.5">
                          <Label htmlFor="fullName" className="text-card-foreground text-sm">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="fullName" type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-10 bg-secondary border-border focus:border-primary h-11" required={isSignUp} />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="phone" className="text-card-foreground text-sm">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="phone" type="tel" placeholder="+31 6 1234 5678" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10 bg-secondary border-border focus:border-primary h-11" required={isSignUp} />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="area" className="text-card-foreground text-sm">Area of Residence</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="area" type="text" placeholder="e.g., Amsterdam, Netherlands" value={areaOfResidence} onChange={(e) => setAreaOfResidence(e.target.value)} className="pl-10 bg-secondary border-border focus:border-primary h-11" required={isSignUp} />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="deliveryAddress" className="text-card-foreground text-sm">Delivery Address *</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <textarea
                              id="deliveryAddress"
                              placeholder={"Street address, building/unit\nCity, State/Province, Postal code\nCountry"}
                              value={deliveryAddress}
                              onChange={(e) => setDeliveryAddress(e.target.value)}
                              className="flex min-h-[80px] w-full rounded-md border border-border bg-secondary px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              required={isSignUp}
                              rows={3}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-card-foreground text-sm">Email address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-secondary border-border focus:border-primary h-11" required />
                    </div>
                  </div>

                  {!isForgotPassword && (
                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="text-card-foreground text-sm">Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 bg-secondary border-border focus:border-primary h-11" required minLength={6} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {isSignUp && !isForgotPassword && (
                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword" className="text-card-foreground text-sm">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="confirmPassword" type={showPassword ? "text" : "password"} placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 bg-secondary border-border focus:border-primary h-11" required minLength={6} />
                      </div>
                      {confirmPassword && password !== confirmPassword && (
                        <p className="text-xs text-destructive mt-1">Passwords do not match</p>
                      )}
                    </div>
                  )}

                  {!isSignUp && !isForgotPassword && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-3.5 w-3.5 rounded border-border accent-primary"
                        />
                        Remember me
                      </label>
                      <button type="button" onClick={() => setIsForgotPassword(true)} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-full h-11">
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        {isForgotPassword ? "Send Reset Link" : isSignUp ? "Create Account" : "Sign In"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                {!isForgotPassword && (
                  <>
                    <div className="relative my-5">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">or continue with</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button type="button" variant="outline" className="h-11 rounded-full border-border" onClick={() => handleOAuth("google")} disabled={loading}>
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                      </Button>

                      <Button type="button" variant="outline" className="h-11 rounded-full border-border" onClick={() => handleOAuth("apple")} disabled={loading}>
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                        </svg>
                        Apple
                      </Button>
                    </div>
                  </>
                )}

                <div className="mt-5 text-center">
                  <button onClick={() => { setIsSignUp(!isSignUp); setIsForgotPassword(false); }} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {isForgotPassword ? "Back to sign in" : isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                  </button>
                </div>
              </div>
            </>
          )}

          <p className="text-center text-xs text-muted-foreground mt-5">
            Sourcing from China, made simple and reliable
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
