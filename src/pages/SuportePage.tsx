import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { portalApi, SolicitacaoSuporte } from '@/lib/api';
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
import { ArrowLeft, MessageSquare, Plus, Loader2, Phone } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export function SuportePage() {
    const [tickets, setTickets] = useState<SolicitacaoSuporte[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        assunto: '',
        mensagem: '',
        telefone_contato: '',
    });

    const fetchTickets = async () => {
        setLoading(true);
        const res = await portalApi.getSuporteTickets();
        if (res.success && res.data) setTickets(res.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const res = await portalApi.createSuporteTicket(form);
        if (res.success) {
            setDialogOpen(false);
            setForm({ assunto: '', mensagem: '', telefone_contato: '' });
            fetchTickets();
        }

        setSubmitting(false);
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'aberto':
            case 'pendente':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'respondido':
            case 'em andamento':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'fechado':
            case 'concluído':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm transition-all">
                <div className="flex items-center gap-3">
                    <Link to="/">
                        <Button variant="ghost" size="icon" className="hover:bg-purple-50">
                            <ArrowLeft className="h-5 w-5 text-purple-700" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-purple-600" />
                        <h1 className="font-bold text-lg text-gray-800">Suporte</h1>
                    </div>
                </div>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-md transition-all">
                            <Plus className="h-4 w-4 mr-1" />
                            Novo Ticket
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl text-purple-900">Abrir Ticket de Suporte</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                            <div className="space-y-2">
                                <Label htmlFor="assunto" className="text-gray-700 font-medium">Assunto</Label>
                                <Input
                                    id="assunto"
                                    type="text"
                                    value={form.assunto}
                                    onChange={(e) =>
                                        setForm({ ...form, assunto: e.target.value })
                                    }
                                    placeholder="Ex: Dúvida sobre notas, Problema no portal..."
                                    required
                                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="telefone" className="text-gray-700 font-medium">Telefone para Contato (WhatsApp)</Label>
                                <div className="relative">
                                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input
                                      id="telefone"
                                      type="tel"
                                      value={form.telefone_contato}
                                      onChange={(e) =>
                                          setForm({ ...form, telefone_contato: e.target.value })
                                      }
                                      placeholder="(11) 99999-9999"
                                      required
                                      className="pl-9 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                                  />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="mensagem" className="text-gray-700 font-medium">Mensagem</Label>
                                <Textarea
                                    id="mensagem"
                                    value={form.mensagem}
                                    onChange={(e) =>
                                        setForm({ ...form, mensagem: e.target.value })
                                    }
                                    placeholder="Descreva detalhadamente o que você precisa..."
                                    required
                                    className="min-h-[120px] border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg resize-none"
                                />
                            </div>
                            
                            <DialogFooter className="pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setDialogOpen(false)}
                                    className="rounded-lg border-gray-300 text-gray-700"
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={submitting} className="rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-md">
                                    {submitting ? (
                                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Enviando...</>
                                    ) : (
                                        'Enviar Ticket'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </header>

            <main className="flex-1 p-4 max-w-2xl mx-auto w-full space-y-4">
                <div className="mb-6 mt-2">
                    <p className="text-sm text-gray-600">
                        Acompanhe abaixo suas solicitações e tickets abertos com a secretaria da sua escola.
                    </p>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-28 w-full rounded-2xl bg-gray-200" />
                        <Skeleton className="h-28 w-full rounded-2xl bg-gray-200" />
                        <Skeleton className="h-28 w-full rounded-2xl bg-gray-200" />
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-sm mt-4">
                        <MessageSquare className="h-16 w-16 mb-4 text-purple-100" />
                        <h3 className="text-lg font-medium text-gray-700 mb-1">Nenhum ticket aberto</h3>
                        <p className="text-sm text-center max-w-xs">Você ainda não enviou nenhuma solicitação para a escola.</p>
                        <Button 
                          variant="outline" 
                          className="mt-6 text-purple-600 border-purple-200 hover:bg-purple-50 rounded-full px-6"
                          onClick={() => setDialogOpen(true)}
                        >
                          Abrir meu primeiro ticket
                        </Button>
                    </div>
                ) : (
                    tickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            className="bg-white p-5 rounded-2xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-semibold text-gray-800 text-lg flex-1 pr-4">{ticket.assunto}</h3>
                                <Badge variant="outline" className={`${getStatusColor(ticket.status)} capitalize px-3 py-1 rounded-full text-xs font-medium border-0`}>
                                    {ticket.status}
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-600 bg-gray-50/80 p-3 rounded-xl mb-4 border border-gray-100">
                                {ticket.mensagem}
                            </p>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-50">
                                <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-2 py-1 rounded-md">
                                  <Phone className="h-3 w-3" />
                                  <span>{ticket.telefone_contato || 'Sem telefone'}</span>
                                </div>
                                <span>Enviado em {format(parseISO(ticket.created_at), 'dd/MM/yyyy HH:mm')}</span>
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
}
