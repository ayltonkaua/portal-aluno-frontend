/**
 * Authentication Context
 * 
 * Handles login via API with email/password.
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, portalApi } from '@/lib/api';

interface AuthUser {
    nome: string;
    matricula: string;
    turma: string;
    escolaNome: string;
    dados_atualizados_em?: string | null;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    shouldUpdateData: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [shouldUpdateData, setShouldUpdateData] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const token = api.getToken();
        if (token) {
            loadUserData();
        } else {
            setIsLoading(false);
        }
    }, []);

    const loadUserData = async () => {
        setIsLoading(true);
        try {
            const [meResponse, escolaResponse] = await Promise.all([
                portalApi.getMe(),
                portalApi.getEscola(),
            ]);

            if (meResponse.success && meResponse.data) {
                setUser({
                    nome: meResponse.data.nome,
                    matricula: meResponse.data.matricula,
                    turma: meResponse.data.turma,
                    escolaNome: escolaResponse.data?.nome || 'Escola',
                    dados_atualizados_em: meResponse.data.dados_atualizados_em,
                });

                // Lógica de verificação de atualização de dados (6 meses)
                if (!meResponse.data.dados_atualizados_em) {
                    setShouldUpdateData(true);
                } else {
                    const ultimaAtu = new Date(meResponse.data.dados_atualizados_em);
                    const seisMesesAtras = new Date();
                    seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);
                    setShouldUpdateData(ultimaAtu < seisMesesAtras);
                }
            } else {
                // Token invalid, clear it
                api.setToken(null);
                setUser(null);
            }
        } catch {
            api.setToken(null);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const result = await portalApi.login(email, password);

            if (result.success && result.data?.aluno) {
                setUser({
                    nome: result.data.aluno.nome,
                    matricula: result.data.aluno.matricula,
                    turma: result.data.aluno.turma,
                    escolaNome: result.data.aluno.escolaNome,
                });
                return { success: true };
            }

            return { success: false, error: result.error || 'Erro ao fazer login' };
        } catch {
            return { success: false, error: 'Erro de conexão' };
        }
    };

    const logout = async () => {
        await portalApi.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                shouldUpdateData,
                login,
                logout,
                refreshUser: loadUserData,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

