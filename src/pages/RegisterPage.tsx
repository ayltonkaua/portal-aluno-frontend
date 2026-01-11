/**
 * Register Page
 * 
 * Create account with matricula verification.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { portalApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GraduationCap, Loader2, AlertCircle, CheckCircle2, Mail, Lock, Hash } from 'lucide-react';

export function RegisterPage() {
    const navigate = useNavigate();
    const [matricula, setMatricula] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            const result = await portalApi.register(matricula.trim(), email.trim(), password);
            if (result.success) {
                setSuccess(true);
            } else {
                setError(result.error || 'Erro ao criar conta');
            }
        } catch {
            setError('Erro ao criar conta');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center p-4">
                <Card className="w-full max-w-md animate-slide-in">
                    <CardContent className="pt-6 text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold">Conta Criada!</h2>
                        <p className="text-muted-foreground">
                            Sua conta foi criada com sucesso. Você já pode fazer login.
                        </p>
                        <Button onClick={() => navigate('/login')} className="w-full">
                            Ir para Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center p-4">
            <Card className="w-full max-w-md animate-slide-in">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                        <GraduationCap className="h-8 w-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-2xl">Criar Conta</CardTitle>
                    <CardDescription>
                        Use sua matrícula para criar uma conta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="matricula">Matrícula</Label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="matricula"
                                    type="text"
                                    placeholder="Sua matrícula escolar"
                                    value={matricula}
                                    onChange={(e) => setMatricula(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                A matrícula deve estar previamente cadastrada pela escola.
                            </p>
                        </div>

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
                            <Label htmlFor="password">Senha</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Repita a senha"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                                    Criando conta...
                                </>
                            ) : (
                                'Criar Conta'
                            )}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            Já tem uma conta?{' '}
                            <Link to="/login" className="text-primary font-medium hover:underline">
                                Fazer login
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
