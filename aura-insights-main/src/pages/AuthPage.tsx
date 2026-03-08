import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Building, Mail, Lock, User, ArrowRight, Loader2, GraduationCap, Landmark, Activity } from "lucide-react";
import { auth } from "@/lib/api";
import { useRole } from "@/hooks/useRole";
import { toast } from "sonner";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [orgCode, setOrgCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'individual' | 'university' | 'corporate' | 'healthcare' | 'government' | 'admin'>('individual');
  const { updateRole } = useRole();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('sentinex_token');
    if (token) navigate("/dashboard");
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await auth.login({ email, password, orgCode: orgCode || undefined });
        const { token, user } = response.data;
        localStorage.setItem('sentinex_token', token);
        localStorage.setItem('sentinex_user', JSON.stringify(user));
        updateRole(user.role);
        toast.success(`Welcome back, ${user.fullName}`);
        navigate("/dashboard");
      } else {
        // Map UI roles to backend roles
        const backendRole = selectedRole === 'admin'
          ? 'super_admin'
          : selectedRole === 'university' ? 'university_admin'
            : selectedRole === 'corporate' ? 'corporate_admin'
              : selectedRole === 'healthcare' ? 'healthcare_admin'
                : selectedRole === 'government' ? 'government_admin'
                  : 'individual';

        const response = await auth.register({
          email,
          password,
          fullName,
          orgCode: orgCode || undefined,
          role: backendRole
        });
        const { token, user } = response.data;
        localStorage.setItem('sentinex_token', token);
        localStorage.setItem('sentinex_user', JSON.stringify(user));
        updateRole(user.role);
        toast.success("Account created successfully");
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Visual Side */}
      <div className="hidden lg:flex flex-col p-12 bg-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="relative z-10 flex flex-col h-full">
          <Link to="/" className="flex items-center gap-3 mb-12 group">
            <img src="/infinity-logo.svg" alt="SENTINEX" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
            <span className="font-display font-bold text-2xl tracking-tight uppercase tracking-tighter text-primary">SENTINEX</span>
          </Link>

          <div className="mt-auto max-w-md">
            <h1 className="font-display text-5xl font-bold leading-tight mb-6 uppercase tracking-tighter">
              Enterprise <br /><span className="text-primary italic">Neural</span> Intelligence.
            </h1>
            <p className="text-muted-foreground text-sm uppercase tracking-[0.2em] font-black leading-relaxed mb-8 opacity-70">
              THE WORLD’S FIRST PREDICTIVE EMOTIONAL INTELLIGENCE SYSTEM FOR EARLY STRESS AND BURNOUT PREVENTION
            </p>
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/5">
              <div>
                <p className="text-3xl font-black font-display text-primary uppercase tracking-tighter">99.9%</p>
                <p className="text-[8px] uppercase tracking-widest text-muted-foreground font-black mt-1">SLA Guarantee</p>
              </div>
              <div>
                <p className="text-3xl font-black font-display text-primary uppercase tracking-tighter">RBAC</p>
                <p className="text-[8px] uppercase tracking-widest text-muted-foreground font-black mt-1">Identity Control</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-8 bg-background relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/20 blur-[120px] rounded-full opacity-20" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-8 relative z-10"
        >
          <div className="text-center lg:text-left">
            <h2 className="font-display text-3xl font-bold mb-2 uppercase tracking-tighter">
              {isLogin ? "Secure Access" : "Register Here"}
            </h2>
            <p className="text-muted-foreground text-[8px] uppercase tracking-[0.3em] font-black opacity-60">
              {isLogin
                ? "Enter your credentials to synchronize with the neural network."
                : ""}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-4 mb-6">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Account Role</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { id: 'individual', label: 'Individual', icon: User },
                      { id: 'university', label: 'University', icon: GraduationCap },
                      { id: 'corporate', label: 'Corporate', icon: Building },
                      { id: 'healthcare', label: 'Healthcare', icon: Activity },
                      { id: 'government', label: 'Government', icon: Landmark },
                      { id: 'admin', label: 'Super Admin', icon: Shield }
                    ].map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id as any)}
                        className={`
                          flex flex-col items-center justify-center gap-3 p-4 rounded-xl border transition-all duration-300
                          ${selectedRole === role.id
                            ? 'bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                            : 'bg-secondary/30 border-white/5 text-muted-foreground hover:border-white/10 hover:bg-secondary/40'}
                        `}
                      >
                        <role.icon className={`w-5 h-5 ${selectedRole === role.id ? 'text-primary' : 'text-muted-foreground/60'}`} />
                        <span className="text-[8px] font-black uppercase tracking-widest">{role.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Identity Name</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-secondary/30 border border-white/5 rounded-xl py-3.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all font-display text-xs"
                      placeholder="Full Name"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex justify-between items-center">
                <span>Invitation Code <span className="text-primary/50 lowercase ml-1 font-normal italic font-sans opacity-60">(Optional)</span></span>
              </label>
              <div className="relative group">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={orgCode}
                  onChange={(e) => setOrgCode(e.target.value)}
                  className="w-full bg-secondary/30 border border-white/5 rounded-xl py-3.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all font-display text-xs uppercase tracking-widest placeholder:lowercase placeholder:tracking-normal"
                  placeholder="CONSENT-ID-XXXX"
                />
              </div>
              <p className="text-[7px] uppercase tracking-widest text-muted-foreground/40 ml-1 italic">
                Provided by your organization administrator
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Professional Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-secondary/30 border border-white/5 rounded-xl py-3.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all font-display text-xs"
                  placeholder="name@domain.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-secondary/30 border border-white/5 rounded-xl py-3.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all font-display text-xs"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-[7px] uppercase tracking-widest text-muted-foreground/40 ml-1 italic">
                Securely encrypted
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary text-white font-display font-black py-3 rounded-xl hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2 group uppercase tracking-[0.2em] text-[10px]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Synchronize" : "Initialize"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <p className="text-center text-[7px] uppercase tracking-[0.15em] text-muted-foreground/60 font-black pt-2">
              🔒 Roles and access are assigned by the system. <br /> Users cannot access unauthorized data.
            </p>
          </form>

          <p className="text-center text-[8px] uppercase tracking-[0.2em] text-muted-foreground font-black opacity-60">
            {isLogin ? "You are new here?" : "Already synchronized?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline ml-1"
            >
              {isLogin ? "Register Now" : "Login"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default AuthPage;
