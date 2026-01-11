/**
 * Atestados Page
 * 
 * List and submit medical certificates.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { portalApi, Atestado } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { ArrowLeft, FileText, Plus, Loader2, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export function AtestadosPage() {
    const [atestados, setAtestados] = useState<Atestado[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        data_inicio: '',
        data_fim: '',
        descricao: '',
    });

    const fetchAtestados = async () => {
        setLoading(true);
        const res = await portalApi.getAtestados();
        if (res.success && res.data) setAtestados(res.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchAtestados();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const res = await portalApi.createAtestado(form);
        if (res.success) {
            setDialogOpen(false);
            setForm({ data_inicio: '', data_fim: '', descricao: '' });
            fetchAtestados();
        }

        setSubmitting(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'aprovado':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejeitado':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <Link to="/">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-orange-600" />
                        <h1 className="font-bold text-lg">Atestados</h1>
                    </div>
                </div>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm">
                            <Plus className="h-4 w-4" />
                            Novo
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Enviar Atestado</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Data Início</Label>
                                    <Input
                                        type="date"
                                        value={form.data_inicio}
                                        onChange={(e) =>
                                            setForm({ ...form, data_inicio: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Data Fim</Label>
                                    <Input
                                        type="date"
                                        value={form.data_fim}
                                        onChange={(e) =>
                                            setForm({ ...form, data_fim: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Descrição/Motivo</Label>
                                <Textarea
                                    value={form.descricao}
                                    onChange={(e) =>
                                        setForm({ ...form, descricao: e.target.value })
                                    }
                                    placeholder="Descreva o motivo (ex: Atestado Médico)"
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setDialogOpen(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        'Enviar'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </header>

            <main className="p-4 max-w-lg mx-auto space-y-3">
                {loading ? (
                    <>
                        <Skeleton className="h-20 w-full rounded-lg" />
                        <Skeleton className="h-20 w-full rounded-lg" />
                    </>
                ) : atestados.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <FileText className="h-12 w-12 mb-2 opacity-20" />
                        <p className="text-sm">Nenhum atestado enviado ainda.</p>
                    </div>
                ) : (
                    atestados.map((at) => (
                        <div
                            key={at.id}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <Calendar className="h-4 w-4 text-purple-500" />
                                    {format(parseISO(at.data_inicio), 'dd/MM')} -{' '}
                                    {format(parseISO(at.data_fim), 'dd/MM/yy')}
                                </div>
                                <Badge variant="outline" className={getStatusColor(at.status)}>
                                    {at.status}
                                </Badge>
                            </div>
                            <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded-md mt-2 italic">
                                "{at.descricao}"
                            </p>
                            <div className="text-[10px] text-gray-400 text-right mt-2">
                                Enviado em {format(parseISO(at.created_at), 'dd/MM/yyyy')}
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
}
