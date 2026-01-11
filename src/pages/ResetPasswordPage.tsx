/**
 * Reset Password Page
 * 
 * Reset password with token from email.
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { portalApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GraduationCap, Loader2, AlertCircle, CheckCircle2, Lock } from 'lucide-react';

export function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Get access token from URL hash (Supabase sends it in the hash)
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        // Check URL hash for access_token (Supabase format)
        const hash = window.location.hash;
        if (hash) {
            const params = new URLSearchParams(hash.substring(1));
            const token = params.get('access_token');
            if (token) {
                setAccessToken(token);
            }
        }

        // Also check query params
        const tokenFromQuery = searchParams.get('access_token');
        if (tokenFromQuery) {
            setAccessToken(tokenFromQuery);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!accessToken) {
            setError('Token de recuperação não encontrado. Solicite um novo link.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (newPassword.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            const result = await portalApi.resetPassword(accessToken, newPassword);
            if (result.success) {
                setSuccess(true);
            } else {
                setError(result.error || 'Erro ao redefinir senha');
            }
        } catch {
            setError('Erro ao redefinir senha');
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
                        <h2 className="text-xl font-bold">Senha Alterada!</h2>
                        <p className="text-muted-foreground">
                            Sua senha foi alterada com sucesso. Você já pode fazer login.
                        </p>
                        <Button onClick={() => navigate('/login')} className="w-full">
                            Ir para Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!accessToken) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center p-4">
                <Card className="w-full max-w-md animate-slide-in">
                    <CardContent className="pt-6 text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="h-8 w-8 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold">Link Inválido</h2>
                        <p className="text-muted-foreground">
                            Este link de recuperação é inválido ou expirou.
                        </p>
                        <Link to="/forgot-password">
                            <Button className="w-full">
                                Solicitar novo link
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
                    <CardTitle className="text-2xl">Redefinir Senha</CardTitle>
                    <CardDescription>
                        Digite sua nova senha
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Nova Senha</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="newPassword"
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Repita a nova senha"
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
                                    Alterando...
                                </>
                            ) : (
                                'Alterar Senha'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
