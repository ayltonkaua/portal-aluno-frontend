/**
 * API Client
 * 
 * HTTP client for Portal Aluno API with authentication.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

class ApiClient {
    private token: string | null = null;

    setToken(token: string | null) {
        this.token = token;
        if (token) {
            localStorage.setItem('portal_token', token);
        } else {
            localStorage.removeItem('portal_token');
        }
    }

    getToken(): string | null {
        if (!this.token) {
            this.token = localStorage.getItem('portal_token');
        }
        return this.token;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const token = this.getToken();

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.error || 'Erro na requisição',
                };
            }

            return data;
        } catch (error) {
            return {
                success: false,
                error: 'Erro de conexão com o servidor',
            };
        }
    }

    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async patch<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body),
        });
    }
}

export const api = new ApiClient();

// ===============
// API Functions
// ===============

export interface StudentData {
    id: string;
    nome: string;
    matricula: string;
    turma: string;
    turma_id: string;
    escola_id: string;
    nome_responsavel?: string;
    telefone_responsavel?: string;
    endereco?: string;
}

export interface FrequenciaStats {
    frequencia: number;
    totalAulas: number;
    totalFaltas: number;
    faltasJustificadas: number;
    status: 'Excelente' | 'Regular' | 'Atenção' | 'Crítico';
}

export interface Atestado {
    id: string;
    data_inicio: string;
    data_fim: string;
    descricao: string;
    status: 'pendente' | 'aprovado' | 'rejeitado';
    created_at: string;
}

export interface BoletimData {
    disciplinas: {
        id: string;
        nome: string;
        cor: string;
        notas: { semestre: number; valor: number; tipo: string }[];
        media: number;
    }[];
}

export interface Beneficio {
    id: string;
    programa_nome: string;
    situacao: string;
    valor?: number;
    data_pagamento?: string | number;
    nome_responsavel?: string;
    cpf_responsavel?: string;
    banco?: string;
    agencia?: string;
    conta?: string;
}

export interface EscolaInfo {
    id: string;
    nome: string;
    endereco?: string;
    telefone?: string;
    email: string;
    cor_primaria: string;
    cor_secundaria: string;
    url_logo?: string;
}

// API Methods
export const portalApi = {
    // Auth
    async login(email: string, password: string): Promise<{
        success: boolean;
        data?: {
            accessToken: string;
            aluno: { id: string; nome: string; matricula: string; turma: string; escolaNome: string };
        };
        error?: string;
    }> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success && data.data?.accessToken) {
            api.setToken(data.data.accessToken);
            if (data.data.refreshToken) {
                localStorage.setItem('portal_refresh', data.data.refreshToken);
            }
        }

        return data;
    },

    async register(matricula: string, email: string, password: string): Promise<{
        success: boolean;
        message?: string;
        data?: { email: string; nome: string };
        error?: string;
    }> {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matricula, email, password }),
        });
        return response.json();
    },

    async forgotPassword(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        return response.json();
    },

    async resetPassword(accessToken: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
        const response = await fetch(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessToken, newPassword }),
        });
        return response.json();
    },

    async logout(): Promise<void> {
        try {
            await api.post('/auth/logout', {});
        } finally {
            api.setToken(null);
            localStorage.removeItem('portal_refresh');
        }
    },

    // Me
    getMe: () => api.get<StudentData>('/me'),
    getFrequencia: () => api.get<FrequenciaStats>('/me/frequencia'),
    updateDados: (data: { nome_responsavel?: string; telefone_responsavel?: string; endereco?: string }) =>
        api.patch<null>('/me/dados', data),

    // Boletim
    getBoletim: () => api.get<BoletimData>('/boletim'),

    // Atestados
    getAtestados: () => api.get<Atestado[]>('/atestados'),
    createAtestado: (data: { data_inicio: string; data_fim: string; descricao: string }) =>
        api.post<Atestado>('/atestados', data),

    // Benefícios
    getBeneficios: () => api.get<Beneficio[]>('/beneficios'),

    // Escola
    getEscola: () => api.get<EscolaInfo>('/escola'),
};


