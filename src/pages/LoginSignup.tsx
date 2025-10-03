import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.jpg";

export default function LoginSignup() {
  const { currentLanguage, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Signup form
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState<"patient" | "doctor">("patient");

  useEffect(() => {
    // Check if already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Get user role
        const { data: roleData } = await (supabase as any)
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
        
        if (roleData?.role === 'doctor') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/patient-dashboard');
        }
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;

      if (data.user) {
        // Get user role
        const { data: roleData } = await (supabase as any)
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();

        toast({
          title: "Login successful",
          description: "Welcome back!",
        });

        // Navigate based on role
        if (roleData?.role === 'doctor') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/patient-dashboard');
        }
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      if (data.user) {
        // Insert user role
        const { error: roleError } = await (supabase as any)
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: signupRole,
          });

        if (roleError) {
          console.error('Error creating role:', roleError);
        }

        toast({
          title: "Account created successfully",
          description: "You can now log in with your credentials.",
        });

        // Switch to login tab
        setLoginEmail(signupEmail);
        setLoginPassword(signupPassword);
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoPatient = async () => {
    setLoading(true);
    try {
      // Demo patient login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "patient@demo.com",
        password: "demo123456",
      });

      if (error) {
        // Create demo patient if doesn't exist
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email: "patient@demo.com",
          password: "demo123456",
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (signupError) throw signupError;

        if (signupData.user) {
          await (supabase as any).from('user_roles').insert({
            user_id: signupData.user.id,
            role: 'patient',
          });
        }

        toast({
          title: "Demo account created",
          description: "Logging in...",
        });

        // Try logging in again
        await supabase.auth.signInWithPassword({
          email: "patient@demo.com",
          password: "demo123456",
        });
      }

      navigate('/patient-dashboard');
    } catch (error: any) {
      toast({
        title: "Demo login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoDoctor = async () => {
    setLoading(true);
    try {
      // Demo doctor login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "doctor@demo.com",
        password: "demo123456",
      });

      if (error) {
        // Create demo doctor if doesn't exist
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email: "doctor@demo.com",
          password: "demo123456",
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (signupError) throw signupError;

        if (signupData.user) {
          await (supabase as any).from('user_roles').insert({
            user_id: signupData.user.id,
            role: 'doctor',
          });
        }

        toast({
          title: "Demo account created",
          description: "Logging in...",
        });

        // Try logging in again
        await supabase.auth.signInWithPassword({
          email: "doctor@demo.com",
          password: "demo123456",
        });
      }

      navigate('/doctor-dashboard');
    } catch (error: any) {
      toast({
        title: "Demo login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={changeLanguage}
        showCenterLogo={true}
        hideLoginButton={true}
      />

      <div className="flex items-center justify-center p-4 py-12">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center pt-8 pb-6">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="HealthConnect Logo" className="h-16 w-16 object-cover rounded-full" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Welcome to HealthConnect</h1>
            <p className="text-muted-foreground">Login or create an account to continue</p>
          </CardHeader>

          <CardContent className="space-y-6 px-8 pb-8">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password (min 6 characters)"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      minLength={6}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">I am a</Label>
                    <Select value={signupRole} onValueChange={(value: any) => setSignupRole(value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patient">Patient</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="space-y-3 pt-4 border-t">
              <p className="text-sm text-muted-foreground text-center">Quick Demo Access:</p>
              <Button 
                variant="outline" 
                onClick={handleDemoPatient} 
                disabled={loading}
                className="w-full text-sm"
              >
                Demo: Login as Patient
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDemoDoctor} 
                disabled={loading}
                className="w-full text-sm"
              >
                Demo: Login as Doctor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
