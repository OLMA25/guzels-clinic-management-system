
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (!success) {
        setError("اسم المستخدم أو كلمة المرور غير صحيحة");
      }
    } catch (err) {
      setError("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-background to-secondary/50 flex items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
          {theme === "light" ? <Moon /> : <Sun />}
        </Button>
      </div>
      
      <div className="w-full max-w-md animate-fade-in">
        <Card className="border border-primary/20 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">مركز غزل للتجميل</CardTitle>
            <CardDescription>تسجيل الدخول إلى نظام إدارة العيادة</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin أو user1"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="border-input focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="admin أو user1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-input focus-visible:ring-primary"
                />
              </div>
              {error && (
                <div className="bg-destructive/10 text-destructive p-2 rounded-md text-sm">
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>رقم المركز: +963956961395</p>
          <p>سوريا - ريف دمشق التل موقف طيبة مقابل المركز الثقافي الجديد</p>
          <p>تابع لعيادة د. رشا معتوق</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
