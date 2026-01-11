/**
 * Forgot Password Page
 * 
 * Send password reset email.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { portalApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GraduationCap, Loader2, AlertCircle, CheckCircle2, Mail, ArrowLeft } from 'lucide-react';

export function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await portalApi.forgotPassword(email.trim());
            if (result.success) {
                setSuccess(true);
            } else {
                setError(result.error || 'Erro ao enviar email');
            }
        } catch {
            setError('Erro ao enviar email');
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
                        <h2 className="text-xl font-bold">Email Enviado!</h2>
                        <p className="text-muted-foreground">
                            Se este email estiver cadastrado, você receberá um link para redefinir sua senha.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Verifique sua caixa de entrada e spam.
                        </p>
                        <Link to="/login">
                            <Button variant="outline" className="w-full">
                                Voltar ao Login
                            </Button>
                        </Link>
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
                    <CardTitle className="text-2xl">Esqueci minha senha</CardTitle>
                    <CardDescription>
                        Digite seu email para receber o link de recuperação
                    </CardDescription>
                </CardHeader>
                <CardContent>
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
                                    Enviando...
                                </>
                            ) : (
                                'Enviar Link'
                            )}
                        </Button>

                        <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary">
                            <ArrowLeft className="h-4 w-4" />
                            Voltar ao login
                        </Link>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
