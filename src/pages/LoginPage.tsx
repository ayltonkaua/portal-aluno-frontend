/**
 * Login Page
 * 
 * Login with email and password.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GraduationCap, Loader2, AlertCircle, Mail, Lock } from 'lucide-react';

export function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(email.trim(), password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.error || 'Erro ao fazer login');
            }
        } catch {
            setError('Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center p-4 sm:p-6">
            <Card className="w-full max-w-sm sm:max-w-md animate-slide-in">
                <CardHeader className="text-center space-y-2 pb-4 sm:pb-6">
                    <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                        <GraduationCap className="h-7 w-7 sm:h-8 sm:w-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl sm:text-2xl">Portal do Aluno</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        Entre com seu e-mail e senha
                    </CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Senha</Label>
                                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                                    Esqueci minha senha
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 p-3 rounded-lg">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Entrando...
                                </>
                            ) : (
                                'Entrar'
                            )}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            Não tem uma conta?{' '}
                            <Link to="/register" className="text-primary font-medium hover:underline">
                                Criar conta
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

