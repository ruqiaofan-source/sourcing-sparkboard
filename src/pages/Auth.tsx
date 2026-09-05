import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { LOGO_DARK as equilinqLogo, LOGO_WHITE as equilinqLogoWhite } from "@/components/PublicLayout";

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

const TEAM_TIGHT = "/team/team-tight-1200.jpg";


const inputClass =
  "h-11 rounded-[0.75rem] border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring";
const labelClass = "label-mono-up text-muted-foreground";

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
    <div className="flex min-h-screen bg-background">
      <SEOHead title="Sign In - Equilinq Sourcing Platform" description="Sign in or create your Equilinq account. Access verified Chinese manufacturers, transparent pricing, and end-to-end sourcing." noindex />

      {/* Left panel, black band */}
      <div data-dark-band className="relative hidden flex-col justify-between overflow-hidden bg-band p-12 text-white lg:flex lg:w-1/2 xl:p-16">
        <div className="surface-grid absolute inset-0 opacity-[0.08]" />
        <div className="relative">
          <Link to="/" className="inline-flex items-center transition-opacity hover:opacity-80">
            <img src={equilinqLogoWhite} alt="Equilinq" className="h-[60px] w-auto object-contain" />
          </Link>

          <h2 className="mt-16 text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
            Source smarter from China.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/85">
            Transparent pricing, verified factories, and end-to-end logistics for European SMEs.
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-white/15">
            <img
              src={TEAM_TIGHT}
              alt="Equilinq sourcing agents at the warehouse in Shenzhen"
              width={1200}
              height={675}
              loading="lazy"
              className="block h-auto w-full object-cover"
            />
          </div>
          <p className="label-mono mt-3 text-white/60">Your agents in Shenzhen</p>
        </div>

      </div>

      {/* Right panel, form */}
      <div className="relative flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
        <div className="surface-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center justify-center lg:hidden">
            <Link to="/" className="inline-flex items-center transition-opacity hover:opacity-80">
              <img src={equilinqLogo} alt="Equilinq" className="h-12 w-auto object-contain" />
            </Link>
          </div>

          {emailSent ? (
            /* Email sent confirmation screen */
            <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-[var(--shadow-lift)] sm:p-10">
              <Mail className="mx-auto mb-6 h-10 w-10 text-primary" />
              <h2 className="text-2xl font-bold text-primary">
                {emailSentType === "signup" ? "Check your inbox" : "Reset link sent"}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-body-ink">
                {emailSentType === "signup"
                  ? <>We've sent a confirmation link to <span className="font-medium text-foreground">{email}</span>. Click the link in the email to verify your account and get started.</>
                  : <>We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>. Check your email and follow the instructions.</>
                }
              </p>
              <p className="mt-6 text-xs text-muted-foreground">
                Didn't receive it? Check your spam folder or try again.
              </p>
              <Button
                variant="outlineInk"
                size="xl"
                className="mt-4"
                onClick={() => {
                  setEmailSent(false);
                  setIsForgotPassword(false);
                  setIsSignUp(false);
                  setPassword("");
                }}
              >
                Back to sign in
              </Button>
            </div>
          ) : (
            /* Login / Signup / Forgot password form */
            <>
              <div className="mb-6">
                <p className="label-mono-up text-primary">
                  {isForgotPassword ? "Password reset" : isSignUp ? "Create account" : "Sign in"}
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary">
                  {isForgotPassword ? "Reset password" : isSignUp ? "Create account" : greeting}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-body-ink">
                  {isForgotPassword
                    ? "Enter your email to receive a reset link"
                    : isSignUp
                    ? "Set up your customer account to get started"
                    : "Sign in to manage your sourcing requests"}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-lift)] sm:p-8">
                <form onSubmit={handleSubmit} className="grid gap-4">
                  {isSignUp && !isForgotPassword && (
                    <>
                      <div className="grid gap-2">
                        <label htmlFor="fullName" className={labelClass}>Full name</label>
                        <Input id="fullName" type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} required={isSignUp} />
                      </div>

                      <div className="grid gap-2">
                        <label htmlFor="phone" className={labelClass}>Phone number</label>
                        <Input id="phone" type="tel" placeholder="+31 6 1234 5678" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} required={isSignUp} />
                      </div>

                      <div className="grid gap-2">
                        <label htmlFor="area" className={labelClass}>Area of residence</label>
                        <Input id="area" type="text" placeholder="e.g., Amsterdam, Netherlands" value={areaOfResidence} onChange={(e) => setAreaOfResidence(e.target.value)} className={inputClass} required={isSignUp} />
                      </div>

                      <div className="grid gap-2">
                        <label htmlFor="deliveryAddress" className={labelClass}>Delivery address</label>
                        <textarea
                          id="deliveryAddress"
                          placeholder={"Street address, building/unit\nCity, State/Province, Postal code\nCountry"}
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          className="min-h-20 w-full resize-none rounded-[0.75rem] border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          required={isSignUp}
                          rows={3}
                        />
                      </div>
                    </>
                  )}

                  <div className="grid gap-2">
                    <label htmlFor="email" className={labelClass}>Email address</label>
                    <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
                  </div>

                  {!isForgotPassword && (
                    <div className="grid gap-2">
                      <label htmlFor="password" className={labelClass}>Password</label>
                      <div className="relative">
                        <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputClass} pr-10`} required minLength={6} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-primary">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {isSignUp && !isForgotPassword && (
                    <div className="grid gap-2">
                      <label htmlFor="confirmPassword" className={labelClass}>Confirm password</label>
                      <Input id="confirmPassword" type={showPassword ? "text" : "password"} placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} required minLength={6} />
                      {confirmPassword && password !== confirmPassword && (
                        <p className="text-xs text-destructive">Passwords do not match</p>
                      )}
                    </div>
                  )}

                  {!isSignUp && !isForgotPassword && (
                    <div className="flex items-center justify-between">
                      <label className="flex cursor-pointer select-none items-center gap-2 text-xs text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-3.5 w-3.5 rounded border-border accent-primary"
                        />
                        Remember me
                      </label>
                      <button type="button" onClick={() => setIsForgotPassword(true)} className="text-xs text-muted-foreground transition-colors hover:text-primary">
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <Button type="submit" size="xl" variant="hero" className="btn-nudge mt-2 w-full" disabled={loading}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        {isForgotPassword ? "Send reset link" : isSignUp ? "Create account" : "Sign in"}
                        <ArrowRight />
                      </>
                    )}
                  </Button>
                </form>

                {!isForgotPassword && (
                  <>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="label-mono-up bg-card px-3 text-muted-foreground">or continue with</span>
                      </div>
                    </div>

                    <Button type="button" variant="outlineInk" size="xl" className="w-full" onClick={() => handleOAuth("google")} disabled={loading}>
                      <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Google
                    </Button>
                  </>
                )}

                <div className="mt-6 text-center">
                  <button onClick={() => { setIsSignUp(!isSignUp); setIsForgotPassword(false); }} className="text-sm text-body-ink transition-colors hover:text-primary">
                    {isForgotPassword ? "Back to sign in" : isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                  </button>
                </div>
              </div>
            </>
          )}

          <p className="label-mono-up mt-6 text-center text-muted-foreground">
            Sourcing from China, made simple and reliable
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
