import { useState, useEffect } from 'react';
import { portalApi, OportunidadeEstagio } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, Building, ChevronRight, DollarSign, Calendar, AlertCircle } from 'lucide-react';

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

export function EstagiosPage() {
    const [estagios, setEstagios] = useState<OportunidadeEstagio[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchEstagios() {
            setLoading(true);
            const res = await portalApi.getEstagios();
            if (res.success && res.data) {
                setEstagios(res.data);
            } else {
                setError(res.error || 'Erro ao carregar vagas de estágio');
            }
            setLoading(false);
        }
        fetchEstagios();
    }, []);

    if (loading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 space-y-4 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 sm:pb-8 font-sans">
            <header className="bg-white sticky top-0 z-10 border-b px-4 py-3 sm:px-6 sm:py-4 lg:px-8 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                        <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                        <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-none">
                            Oportunidades de Estágio
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                            Comece sua jornada profissional
                        </p>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-4 sm:py-6 lg:py-8 max-w-6xl">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 mb-4 text-sm shadow-sm">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {error}
                    </div>
                )}

                {estagios.length === 0 && !error ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm max-w-2xl mx-auto">
                        <Briefcase className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-sm font-semibold text-gray-900">Nenhuma vaga aberta</h3>
                        <p className="text-xs text-gray-500 mt-1">Volte em breve para conferir novas oportunidades de estágio.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {estagios.map(vaga => (
                            <Card key={vaga.id} className="bg-white border-none shadow-sm ring-1 ring-gray-100 hover:shadow-md hover:ring-purple-200 transition-all group flex flex-col justify-between">
                                <div>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start gap-2 mb-2">
                                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100 font-medium">
                                                Nova Vaga
                                            </Badge>
                                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(vaga.data_publicacao)}
                                            </span>
                                        </div>
                                        <CardTitle className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1">
                                            {vaga.cargo}
                                        </CardTitle>
                                        <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 mt-1 font-medium truncate">
                                            <Building className="h-3.5 w-3.5 shrink-0" />
                                            {vaga.empresa || 'Empresa Confidencial'}
                                        </p>
                                    </CardHeader>
                                    <CardContent className="pb-4">
                                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed mb-3">
                                            {vaga.descricao}
                                        </p>
                                        {vaga.bolsa && (
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50/50 p-2 rounded-lg">
                                                <DollarSign className="h-4 w-4" />
                                                Bolsa: R$ {Number(vaga.bolsa).toFixed(2).replace('.', ',')}
                                            </div>
                                        )}
                                    </CardContent>
                                </div>
                                <div className="p-4 pt-0 mt-auto">
                                    <a
                                        href={vaga.link_inscricao || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                                            vaga.link_inscricao
                                                ? 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                                                : 'bg-gray-50 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        {vaga.link_inscricao ? 'Inscrever-se' : 'Inscrições em breve'}
                                        {vaga.link_inscricao && <ChevronRight className="h-4 w-4" />}
                                    </a>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
