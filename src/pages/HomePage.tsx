/**
 * Home Page - Portal Aluno
 * 
 * Mobile-First Dashboard with frequency, actions, and benefits.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { portalApi, FrequenciaStats, Beneficio } from '@/lib/api';
import { AttendanceRing } from '@/components/AttendanceRing';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    FileText,
    GraduationCap,
    QrCode,
    User,
    Bell,
    LogOut,
    Calendar,
    CreditCard,
} from 'lucide-react';

// Helper: Format CPF
function formatCPF(cpf: string | number | undefined | null): string {
    if (cpf === null || cpf === undefined || cpf === '') return 'Não informado';
    const cpfStr = String(cpf);
    const clean = cpfStr.replace(/\D/g, '');
    if (clean.length !== 11) return cpfStr;
    return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Helper: Format date
function formatDate(date: string | number | undefined): string {
    if (!date) return '--/--/----';

    // Excel serial number
    const dateNum = Number(date);
    if (!isNaN(dateNum) && !String(date).includes('-')) {
        const jsDate = new Date((dateNum - 25569) * 86400 * 1000);
        jsDate.setHours(jsDate.getHours() + 12);
        return jsDate.toLocaleDateString('pt-BR');
    }

    // ISO date string
    if (String(date).includes('-')) {
        return new Date(date).toLocaleDateString('pt-BR');
    }

    return String(date);
}

// Helper: Format currency
function formatCurrency(value: number | undefined): string {
    if (!value) return 'Valor não informado';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function HomePage() {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState<FrequenciaStats | null>(null);
    const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const [statsRes, benRes] = await Promise.all([
                portalApi.getFrequencia(),
                portalApi.getBeneficios(),
            ]);
            if (statsRes.success && statsRes.data) setStats(statsRes.data);
            if (benRes.success && benRes.data) setBeneficios(benRes.data);
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 space-y-4">
                <Skeleton className="h-16 sm:h-20 w-full rounded-xl" />
                <Skeleton className="h-32 sm:h-40 w-full rounded-xl" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <Skeleton className="h-28 sm:h-32 w-full rounded-xl" />
                    <Skeleton className="h-28 sm:h-32 w-full rounded-xl" />
                    <Skeleton className="h-28 sm:h-32 w-full rounded-xl" />
                    <Skeleton className="h-28 sm:h-32 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 sm:pb-8 font-sans">
            {/* HEADER - Mobile First */}
            <header className="bg-white sticky top-0 z-10 border-b px-4 py-3 sm:px-6 sm:py-4 lg:px-8 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold border border-purple-200 shadow-sm text-sm sm:text-base">
                        {user?.nome?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div>
                        <h1 className="text-sm sm:text-base font-bold text-gray-900 leading-none">
                            Olá, {user?.nome?.split(' ')[0]}
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate max-w-[120px] sm:max-w-xs">
                            {user?.escolaNome}
                        </p>
                    </div>
                </div>
                <div className="flex gap-1 sm:gap-2">
                    <Button variant="ghost" size="icon" className="text-gray-500 h-9 w-9 sm:h-10 sm:w-10">
                        <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={logout}
                        className="text-red-500 hover:bg-red-50 h-9 w-9 sm:h-10 sm:w-10"
                    >
                        <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                </div>
            </header>

            {/* MAIN - Responsive Container */}
            <main className="container mx-auto px-4 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 max-w-xl sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl">

                {/* OVERVIEW CARD */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="bg-white shadow-sm border-none overflow-hidden relative ring-1 ring-gray-100">
                        <div
                            className={`absolute top-0 left-0 w-1 sm:w-1.5 h-full ${(stats?.frequencia || 0) >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                        />
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                    Situação Atual
                                </p>
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800">{user?.turma}</h2>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <Badge
                                        variant="secondary"
                                        className={`text-[10px] sm:text-xs ${(stats?.frequencia || 0) >= 75
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-red-50 text-red-700'
                                            }`}
                                    >
                                        {stats?.status}
                                    </Badge>
                                    <span className="text-[10px] sm:text-xs text-gray-400 flex items-center">
                                        {stats?.totalFaltas} faltas
                                    </span>
                                </div>
                            </div>
                            <AttendanceRing percentage={stats?.frequencia || 0} />
                        </CardContent>
                    </Card>

                    {/* Matrícula Card - Mobile shows after, Desktop side by side */}
                    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-4 sm:p-5 text-white shadow-lg shadow-purple-200/50 flex flex-col justify-between min-h-[100px] sm:min-h-[120px]">
                        <div className="flex justify-between items-start">
                            <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                                <QrCode className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-medium bg-white/20 px-2 py-1 rounded-full">
                                ID Estudantil
                            </span>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-medium opacity-90 mb-0.5">Matrícula</p>
                            <p className="text-lg sm:text-xl font-mono font-bold tracking-widest">
                                {user?.matricula}
                            </p>
                        </div>
                    </div>
                </section>

                {/* QUICK ACTIONS - Responsive Grid */}
                <section>
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-2 sm:mb-3 px-1">
                        Serviços Acadêmicos
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                        <Link to="/boletim">
                            <Button
                                variant="outline"
                                className="h-auto w-full flex-col gap-2 sm:gap-3 py-4 sm:py-6 border-none shadow-sm bg-white hover:bg-purple-50 hover:text-purple-700 transition-all group"
                            >
                                <div className="p-2 sm:p-3 bg-pink-50 rounded-xl sm:rounded-2xl text-pink-600 group-hover:scale-110 transition-transform">
                                    <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div className="text-center">
                                    <span className="text-[10px] sm:text-xs font-bold block text-gray-700 group-hover:text-purple-700">
                                        Boletim
                                    </span>
                                    <span className="text-[8px] sm:text-[10px] text-gray-400 font-normal hidden sm:block">
                                        Ver notas
                                    </span>
                                </div>
                            </Button>
                        </Link>

                        <Link to="/atestados">
                            <Button
                                variant="outline"
                                className="h-auto w-full flex-col gap-2 sm:gap-3 py-4 sm:py-6 border-none shadow-sm bg-white hover:bg-purple-50 hover:text-purple-700 transition-all group"
                            >
                                <div className="p-2 sm:p-3 bg-orange-50 rounded-xl sm:rounded-2xl text-orange-600 group-hover:scale-110 transition-transform">
                                    <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div className="text-center">
                                    <span className="text-[10px] sm:text-xs font-bold block text-gray-700 group-hover:text-purple-700">
                                        Atestados
                                    </span>
                                    <span className="text-[8px] sm:text-[10px] text-gray-400 font-normal hidden sm:block">
                                        Enviar/Ver
                                    </span>
                                </div>
                            </Button>
                        </Link>

                        <Link to="/meus-dados">
                            <Button
                                variant="outline"
                                className="h-auto w-full flex-col gap-2 sm:gap-3 py-4 sm:py-6 border-none shadow-sm bg-white hover:bg-purple-50 hover:text-purple-700 transition-all group"
                            >
                                <div className="p-2 sm:p-3 bg-indigo-50 rounded-xl sm:rounded-2xl text-indigo-600 group-hover:scale-110 transition-transform">
                                    <User className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div className="text-center">
                                    <span className="text-[10px] sm:text-xs font-bold block text-gray-700 group-hover:text-purple-700">
                                        Meus Dados
                                    </span>
                                    <span className="text-[8px] sm:text-[10px] text-gray-400 font-normal hidden sm:block">
                                        Atualizar
                                    </span>
                                </div>
                            </Button>
                        </Link>

                        <Link to="/carteirinha">
                            <Button
                                variant="outline"
                                className="h-auto w-full flex-col gap-2 sm:gap-3 py-4 sm:py-6 border-none shadow-sm bg-white hover:bg-purple-50 hover:text-purple-700 transition-all group"
                            >
                                <div className="p-2 sm:p-3 bg-purple-50 rounded-xl sm:rounded-2xl text-purple-600 group-hover:scale-110 transition-transform">
                                    <QrCode className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div className="text-center">
                                    <span className="text-[10px] sm:text-xs font-bold block text-gray-700 group-hover:text-purple-700">
                                        Carteirinha
                                    </span>
                                    <span className="text-[8px] sm:text-[10px] text-gray-400 font-normal hidden sm:block">
                                        ID Digital
                                    </span>
                                </div>
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* BENEFITS - Full Details, Responsive Grid */}
                {beneficios.length > 0 && (
                    <section>
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-2 sm:mb-3 px-1">
                            Benefícios e Auxílios
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {beneficios.map((b) => (
                                <Card
                                    key={b.id}
                                    className="bg-white border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <CardContent className="p-3 sm:p-4 space-y-3">
                                        {/* Header */}
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-sm sm:text-base text-gray-900 truncate">
                                                    🎁 {b.programa_nome}
                                                </h4>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={`shrink-0 text-[9px] sm:text-[10px] ${b.situacao === 'Ativo'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    : 'bg-gray-50 text-gray-600 border-gray-200'
                                                    }`}
                                            >
                                                {b.situacao}
                                            </Badge>
                                        </div>

                                        {/* Value & Date */}
                                        <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                                            <div>
                                                <span className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-medium block">
                                                    Valor
                                                </span>
                                                <span className="font-bold text-emerald-600 text-sm sm:text-base">
                                                    {formatCurrency(b.valor)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-medium block">
                                                    Data Pagamento
                                                </span>
                                                <span className="font-medium text-gray-800 flex items-center gap-1">
                                                    <Calendar className="h-3 w-3 text-gray-400" />
                                                    {formatDate(b.data_pagamento)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Responsável */}
                                        <div className="bg-gray-50 rounded-lg p-2 space-y-1">
                                            <span className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-medium block">
                                                Responsável
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 shrink-0" />
                                                <div className="min-w-0">
                                                    <span className="font-medium text-gray-800 text-xs sm:text-sm block truncate uppercase">
                                                        {b.nome_responsavel || 'Não informado'}
                                                    </span>
                                                    <span className="text-[10px] sm:text-xs text-gray-500 font-mono">
                                                        CPF: {formatCPF(b.cpf_responsavel)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bank Info */}
                                        {(b.banco || b.conta) && (
                                            <div className="flex items-center gap-2 text-[10px] sm:text-xs">
                                                <CreditCard className="h-3 w-3 text-gray-400 shrink-0" />
                                                <span className="font-mono text-gray-600 truncate">
                                                    {b.banco} | Ag: {b.agencia || '--'} | Cc: {b.conta || '--'}
                                                </span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {beneficios.length === 0 && (
                    <section>
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-500 mb-2 sm:mb-3 px-1">
                            Benefícios e Auxílios
                        </h3>
                        <div className="bg-white border border-dashed border-gray-200 rounded-xl p-4 sm:p-6 text-center text-gray-400 text-xs sm:text-sm">
                            Nenhum benefício vinculado à sua matrícula.
                        </div>
                    </section>
                )}

                {/* REMINDER */}
                <section className="bg-blue-50 rounded-xl p-3 sm:p-4 border border-blue-100 flex gap-2 sm:gap-3 items-start">
                    <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full text-blue-600 shrink-0">
                        <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                    <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-blue-900">
                            Mantenha sua frequência!
                        </h4>
                        <p className="text-[10px] sm:text-xs text-blue-700 mt-0.5 sm:mt-1">
                            Lembre-se: para ser aprovado, você precisa de no mínimo{' '}
                            <strong>75% de presença</strong>.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}
