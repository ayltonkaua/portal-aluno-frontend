/**
 * Home Page
 * 
 * Main dashboard showing frequency, quick actions, and benefits.
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
} from 'lucide-react';

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
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-40 w-full rounded-xl" />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-24 font-sans">
            {/* HEADER */}
            <header className="bg-white sticky top-0 z-10 border-b px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold border border-purple-200 shadow-sm">
                        {user?.nome?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-gray-900 leading-none">
                            Olá, {user?.nome?.split(' ')[0]}
                        </h1>
                        <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[150px]">
                            {user?.escolaNome}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="text-gray-500">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={logout}
                        className="text-red-500 hover:bg-red-50"
                    >
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 space-y-6 max-w-lg">
                {/* OVERVIEW CARD */}
                <section className="grid grid-cols-1 gap-4">
                    <Card className="bg-white shadow-sm border-none overflow-hidden relative ring-1 ring-gray-100">
                        <div
                            className={`absolute top-0 left-0 w-1.5 h-full ${(stats?.frequencia || 0) >= 75 ? 'bg-green-500' : 'bg-red-500'
                                }`}
                        />
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                    Situação Atual
                                </p>
                                <h2 className="text-xl font-bold text-gray-800">{user?.turma}</h2>
                                <div className="flex gap-2 mt-2">
                                    <Badge
                                        variant="secondary"
                                        className={
                                            (stats?.frequencia || 0) >= 75
                                                ? 'bg-green-50 text-green-700'
                                                : 'bg-red-50 text-red-700'
                                        }
                                    >
                                        {stats?.status}
                                    </Badge>
                                    <span className="text-xs text-gray-400 flex items-center">
                                        {stats?.totalFaltas} faltas registradas
                                    </span>
                                </div>
                            </div>
                            <AttendanceRing percentage={stats?.frequencia || 0} />
                        </CardContent>
                    </Card>
                </section>

                {/* QUICK ACTIONS */}
                <section>
                    <h3 className="text-sm font-semibold text-gray-500 mb-3 px-1">
                        Serviços Acadêmicos
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <Link to="/boletim">
                            <Button
                                variant="outline"
                                className="h-auto w-full flex-col gap-3 py-6 border-none shadow-sm bg-white hover:bg-purple-50 hover:text-purple-700 transition-all group"
                            >
                                <div className="p-3 bg-pink-50 rounded-2xl text-pink-600 group-hover:scale-110 transition-transform">
                                    <GraduationCap className="h-6 w-6" />
                                </div>
                                <div className="text-center">
                                    <span className="text-xs font-bold block text-gray-700 group-hover:text-purple-700">
                                        Boletim
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-normal">
                                        Ver notas
                                    </span>
                                </div>
                            </Button>
                        </Link>

                        <Link to="/atestados">
                            <Button
                                variant="outline"
                                className="h-auto w-full flex-col gap-3 py-6 border-none shadow-sm bg-white hover:bg-purple-50 hover:text-purple-700 transition-all group"
                            >
                                <div className="p-3 bg-orange-50 rounded-2xl text-orange-600 group-hover:scale-110 transition-transform">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div className="text-center">
                                    <span className="text-xs font-bold block text-gray-700 group-hover:text-purple-700">
                                        Atestados
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-normal">
                                        Enviar/Ver
                                    </span>
                                </div>
                            </Button>
                        </Link>

                        <Link to="/meus-dados">
                            <Button
                                variant="outline"
                                className="h-auto w-full flex-col gap-3 py-6 border-none shadow-sm bg-white hover:bg-purple-50 hover:text-purple-700 transition-all group"
                            >
                                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:scale-110 transition-transform">
                                    <User className="h-6 w-6" />
                                </div>
                                <div className="text-center">
                                    <span className="text-xs font-bold block text-gray-700 group-hover:text-purple-700">
                                        Meus Dados
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-normal">
                                        Atualizar
                                    </span>
                                </div>
                            </Button>
                        </Link>

                        <Link to="/carteirinha">
                            <Button
                                variant="outline"
                                className="h-auto w-full flex-col gap-3 py-6 border-none shadow-sm bg-white hover:bg-purple-50 hover:text-purple-700 transition-all group"
                            >
                                <div className="p-3 bg-purple-50 rounded-2xl text-purple-600 group-hover:scale-110 transition-transform">
                                    <QrCode className="h-6 w-6" />
                                </div>
                                <div className="text-center">
                                    <span className="text-xs font-bold block text-gray-700 group-hover:text-purple-700">
                                        Carteirinha
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-normal">
                                        ID Digital
                                    </span>
                                </div>
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* BENEFITS */}
                {beneficios.length > 0 && (
                    <section>
                        <h3 className="text-sm font-semibold text-gray-500 mb-3 px-1">
                            Benefícios e Auxílios
                        </h3>
                        <div className="space-y-3">
                            {beneficios.map((b) => (
                                <Card
                                    key={b.id}
                                    className="bg-white border-l-4 border-l-emerald-500 shadow-sm"
                                >
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-gray-900">
                                                    🎁 {b.programa_nome}
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {b.situacao}
                                                </p>
                                            </div>
                                            {b.valor && (
                                                <span className="text-lg font-bold text-emerald-600">
                                                    {new Intl.NumberFormat('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL',
                                                    }).format(b.valor)}
                                                </span>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {/* REMINDER */}
                <section className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex gap-3 items-start">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                        <Bell className="h-4 w-4" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-blue-900">
                            Mantenha sua frequência!
                        </h4>
                        <p className="text-xs text-blue-700 mt-1">
                            Lembre-se: para ser aprovado, você precisa de no mínimo{' '}
                            <strong>75% de presença</strong>.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}
