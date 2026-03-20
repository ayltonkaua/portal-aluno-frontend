import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { portalApi, StudentData } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, User, Phone, MapPin, Briefcase, Edit2, Calendar, Hash, Users } from 'lucide-react';
import { DataUpdateModal } from '@/components/DataUpdateModal';

function formatDate(dateString?: string) {
    if (!dateString) return '-';
    // Se a data vier no formato AAAA-MM-DD
    if (dateString.includes('-')) {
        const [ano, mes, dia] = dateString.split('-');
        return `${dia}/${mes}/${ano}`;
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function YesNoBadge({ value, label }: { value?: boolean, label: string }) {
    return (
        <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-indigo-100 transition-colors">
            <span className="text-sm font-medium text-slate-700">{label}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${value ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {value ? 'Sim' : 'Não'}
            </span>
        </div>
    );
}

export function MeusDadosPage() {
    const [data, setData] = useState<StudentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const loadData = useCallback(async () => {
        setLoading(true);
        const res = await portalApi.getMe();
        if (res.success && res.data) {
            setData(res.data);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleCloseEdit = () => {
        setIsEditing(false);
        loadData(); // Reload data after modal closes
    };

    if (loading && !data) {
        return (
            <div className="min-h-screen bg-slate-50 p-4 space-y-4 max-w-3xl mx-auto py-8">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-8">
            <DataUpdateModal 
                openEdit={isEditing} 
                onCloseEdit={handleCloseEdit} 
                initialData={data} 
            />

            {/* Header */}
            <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <Link to="/">
                        <Button variant="ghost" size="icon" className="hover:bg-slate-100 text-slate-600">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-indigo-600" />
                        </div>
                        <h1 className="font-bold text-lg text-slate-800 tracking-tight">Meu Perfil</h1>
                    </div>
                </div>
                <Button 
                    onClick={() => setIsEditing(true)} 
                    variant="default" 
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm rounded-lg"
                >
                    <Edit2 className="h-4 w-4" />
                    <span className="hidden sm:inline font-medium">Editar meus dados</span>
                    <span className="sm:hidden font-medium">Editar</span>
                </Button>
            </header>

            <main className="p-4 max-w-3xl mx-auto space-y-6 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Dados Pessoais */}
                <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="bg-white border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                            <div className="p-1.5 bg-indigo-50 rounded-md">
                                <User className="h-4 w-4 text-indigo-600" />
                            </div>
                            Dados Pessoais
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 bg-slate-50/30">
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <span className="text-slate-500 text-xs flex items-center gap-1.5 mb-1.5 font-medium">
                                <User className="h-3.5 w-3.5" /> Nome Completo
                            </span>
                            <p className="font-semibold text-slate-800 truncate" title={data?.nome}>{data?.nome || '-'}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <span className="text-slate-500 text-xs flex items-center gap-1.5 mb-1.5 font-medium">
                                <Hash className="h-3.5 w-3.5" /> Matrícula
                            </span>
                            <p className="font-semibold text-slate-800">{data?.matricula || '-'}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <span className="text-slate-500 text-xs flex items-center gap-1.5 mb-1.5 font-medium">
                                <Calendar className="h-3.5 w-3.5" /> Data de Nascimento
                            </span>
                            <p className="font-semibold text-slate-800">{formatDate(data?.data_nascimento)}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Contatos e Endereço */}
                <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="bg-white border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                            <div className="p-1.5 bg-indigo-50 rounded-md">
                                <Phone className="h-4 w-4 text-indigo-600" />
                            </div>
                            Contatos e Localização
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid gap-6 sm:grid-cols-2 bg-slate-50/30">
                        {/* Contato Principal */}
                        <div className="space-y-4">
                            <div className="bg-white border border-slate-100 shadow-sm p-4 rounded-xl">
                                <span className="text-slate-500 text-xs flex items-center gap-1.5 mb-1.5 font-medium">
                                    <Phone className="h-3.5 w-3.5" /> Seu Telefone / WhatsApp
                                </span>
                                <p className="font-semibold text-slate-800">{data?.telefone_aluno || 'Não informado'}</p>
                            </div>
                            
                            <div className="bg-white border border-slate-100 shadow-sm p-4 rounded-xl">
                                <span className="text-slate-500 text-xs flex items-center gap-1.5 mb-1.5 font-medium">
                                    <MapPin className="h-3.5 w-3.5" /> Endereço Completo
                                </span>
                                <p className="font-semibold text-slate-800 line-clamp-2" title={data?.endereco}>{data?.endereco || 'Não informado'}</p>
                            </div>
                        </div>

                        {/* Contatos Responsável */}
                        <div className="bg-indigo-50/40 border border-indigo-100/60 shadow-sm p-5 rounded-xl space-y-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-2 h-full bg-indigo-500" />
                            <div className="flex items-center gap-2 mb-3">
                                <Users className="h-5 w-5 text-indigo-600" />
                                <h3 className="font-bold text-indigo-950">Responsável Familiar</h3>
                            </div>
                            <div className="bg-white/60 p-3 rounded-lg border border-indigo-50">
                                <span className="text-indigo-600/80 text-xs font-medium mb-1 block">Nome Completo</span>
                                <p className="font-semibold text-slate-800 truncate">{data?.nome_responsavel || 'Não informado'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/60 p-3 rounded-lg border border-indigo-50">
                                    <span className="text-indigo-600/80 text-xs font-medium mb-1 block">Telefone 1</span>
                                    <p className="font-semibold text-slate-800 text-sm">{data?.telefone_responsavel || '-'}</p>
                                </div>
                                <div className="bg-white/60 p-3 rounded-lg border border-indigo-50">
                                    <span className="text-indigo-600/80 text-xs font-medium mb-1 block">Telefone 2</span>
                                    <p className="font-semibold text-slate-800 text-sm">{data?.telefone_responsavel_2 || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Dados Socioeconômicos */}
                <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden mb-8">
                    <CardHeader className="bg-white border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                            <div className="p-1.5 bg-indigo-50 rounded-md">
                                <Briefcase className="h-4 w-4 text-indigo-600" />
                            </div>
                            Dados Socioeconômicos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 bg-slate-50/30">
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            <YesNoBadge label="Você Trabalha?" value={data?.trabalha} />
                            <YesNoBadge label="Mora com a Família?" value={data?.mora_com_familia} />
                            <YesNoBadge label="Recebe Bolsa Família?" value={data?.recebe_bolsa_familia} />
                            <YesNoBadge label="Recebe Pé-de-Meia?" value={data?.recebe_pe_de_meia} />
                            <YesNoBadge label="Usa Transporte Escolar?" value={data?.usa_transporte} />
                            <YesNoBadge label="Tem Passe Livre?" value={data?.tem_passe_livre} />
                        </div>
                    </CardContent>
                </Card>

            </main>
        </div>
    );
}
