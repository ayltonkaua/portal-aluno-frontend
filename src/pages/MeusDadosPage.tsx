/**
 * Meus Dados Page
 * 
 * Update student cadastral data.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { portalApi, StudentData } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, User, Save, Loader2, CheckCircle } from 'lucide-react';

export function MeusDadosPage() {
    const [data, setData] = useState<StudentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState({
        nome_responsavel: '',
        telefone_responsavel: '',
        endereco: '',
    });

    useEffect(() => {
        async function fetch() {
            setLoading(true);
            const res = await portalApi.getMe();
            if (res.success && res.data) {
                setData(res.data);
                setForm({
                    nome_responsavel: res.data.nome_responsavel || '',
                    telefone_responsavel: res.data.telefone_responsavel || '',
                    endereco: res.data.endereco || '',
                });
            }
            setLoading(false);
        }
        fetch();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSaved(false);

        const res = await portalApi.updateDados(form);
        if (res.success) {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }

        setSaving(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 space-y-4">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
                <Link to="/">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-indigo-600" />
                    <h1 className="font-bold text-lg">Meus Dados</h1>
                </div>
            </header>

            <main className="p-4 max-w-lg mx-auto">
                {/* Info */}
                <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500 text-xs">Nome</span>
                            <p className="font-medium text-gray-800">{data?.nome}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-xs">Matrícula</span>
                            <p className="font-medium text-gray-800">{data?.matricula}</p>
                        </div>
                        <div className="col-span-2">
                            <span className="text-gray-500 text-xs">Turma</span>
                            <p className="font-medium text-gray-800">{data?.turma}</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 shadow-sm border space-y-4">
                    <h2 className="font-semibold text-gray-700">Dados do Responsável</h2>

                    <div className="space-y-2">
                        <Label>Nome do Responsável</Label>
                        <Input
                            value={form.nome_responsavel}
                            onChange={(e) =>
                                setForm({ ...form, nome_responsavel: e.target.value })
                            }
                            placeholder="Nome completo"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Telefone</Label>
                        <Input
                            value={form.telefone_responsavel}
                            onChange={(e) =>
                                setForm({ ...form, telefone_responsavel: e.target.value })
                            }
                            placeholder="(00) 00000-0000"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Endereço</Label>
                        <Input
                            value={form.endereco}
                            onChange={(e) => setForm({ ...form, endereco: e.target.value })}
                            placeholder="Rua, número, bairro"
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Salvando...
                            </>
                        ) : saved ? (
                            <>
                                <CheckCircle className="h-4 w-4" />
                                Salvo!
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Salvar Alterações
                            </>
                        )}
                    </Button>
                </form>
            </main>
        </div>
    );
}
