import { useState, useEffect } from 'react';
import { portalApi, Comunicado } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Megaphone, Calendar, AlertCircle } from 'lucide-react';

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
}

function getBadgeProps(tipo: string) {
    switch (tipo) {
        case 'Importante': return { label: 'Importante', class: 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200' };
        case 'Evento': return { label: 'Evento', class: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200' };
        default: return { label: 'Aviso', class: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200' };
    }
}

export function AvisosPage() {
    const [avisos, setAvisos] = useState<Comunicado[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAvisos() {
            setLoading(true);
            const res = await portalApi.getAvisos();
            if (res.success && res.data) {
                setAvisos(res.data);
            } else {
                setError(res.error || 'Erro ao carregar avisos');
            }
            setLoading(false);
        }
        fetchAvisos();
    }, []);

    if (loading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 space-y-4 max-w-4xl mx-auto">
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-32 w-full rounded-2xl" />
                <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 sm:pb-8 font-sans">
            <header className="bg-white sticky top-0 z-10 border-b px-4 py-3 sm:px-6 sm:py-4 lg:px-8 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                        <Megaphone className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                        <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-none">
                            Mural de Avisos
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                            Fique por dentro das novidades da escola
                        </p>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-4 sm:py-6 lg:py-8 max-w-4xl">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 mb-4 text-sm shadow-sm">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {error}
                    </div>
                )}

                {avisos.length === 0 && !error ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
                        <Megaphone className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-sm font-semibold text-gray-900">Nenhum aviso no momento</h3>
                        <p className="text-xs text-gray-500 mt-1">Sua escola ainda não publicou nenhum comunicado recente.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {avisos.map(aviso => {
                            const badge = getBadgeProps(aviso.tipo);
                            return (
                                <Card key={aviso.id} className="bg-white border-none shadow-sm ring-1 ring-gray-100 hover:shadow-md transition-shadow group overflow-hidden">
                                    <div className="w-1.5 h-full absolute left-0 top-0 bg-gradient-to-b from-purple-500 to-indigo-600 hidden group-hover:block transition-all" />
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start gap-4">
                                            <Badge variant="outline" className={`shrink-0 ${badge.class}`}>
                                                {badge.label}
                                            </Badge>
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(aviso.data_publicacao)}
                                            </span>
                                        </div>
                                        <CardTitle className="text-base sm:text-lg font-bold text-gray-900 mt-2">
                                            {aviso.titulo}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                                            {aviso.conteudo}
                                        </p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
