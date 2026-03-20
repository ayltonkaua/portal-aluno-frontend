import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { portalApi } from '@/lib/api';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function DataUpdateModal({ 
    openEdit = false, 
    onCloseEdit, 
    initialData 
}: { 
    openEdit?: boolean; 
    onCloseEdit?: () => void;
    initialData?: any;
} = {}) {
    const { shouldUpdateData, refreshUser, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        data_nascimento: '',
        trabalha: false,
        mora_com_familia: true,
        recebe_bolsa_familia: false,
        recebe_pe_de_meia: false,
        usa_transporte: false,
        tem_passe_livre: false,
        endereco: '',
        telefone_aluno: '',
        nome_responsavel: '',
        telefone_responsavel: '',
        telefone_responsavel_2: '',
    });

    useEffect(() => {
        if (initialData && openEdit) {
            setFormData({
                data_nascimento: initialData.data_nascimento || '',
                trabalha: initialData.trabalha || false,
                mora_com_familia: initialData.mora_com_familia ?? true,
                recebe_bolsa_familia: initialData.recebe_bolsa_familia || false,
                recebe_pe_de_meia: initialData.recebe_pe_de_meia || false,
                usa_transporte: initialData.usa_transporte || false,
                tem_passe_livre: initialData.tem_passe_livre || false,
                endereco: initialData.endereco || '',
                telefone_aluno: initialData.telefone_aluno || '',
                nome_responsavel: initialData.nome_responsavel || '',
                telefone_responsavel: initialData.telefone_responsavel || '',
                telefone_responsavel_2: initialData.telefone_responsavel_2 || '',
            });
        }
    }, [initialData, openEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await portalApi.updateDados(formData);
            if (res.success) {
                setSuccess(true);
                setTimeout(async () => {
                    await refreshUser();
                    if (!shouldUpdateData && onCloseEdit) {
                        onCloseEdit();
                        setSuccess(false);
                    }
                }, 1500);
            } else {
                setError(res.error || 'Erro ao atualizar dados');
            }
        } catch (err) {
            setError('Erro de conexão');
        } finally {
            setLoading(false);
        }
    };

    const handleRadioChange = (field: string, value: boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const isVisible = shouldUpdateData || openEdit;
    if (!isVisible) return null;

    const preventClose = shouldUpdateData;

    return (
        <Dialog open={isVisible} onOpenChange={(val) => {
            if (!preventClose && !val && onCloseEdit) {
                onCloseEdit();
            }
        }}>
            <DialogContent 
                className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto" 
                onPointerDownOutside={(e) => preventClose && e.preventDefault()} 
                onEscapeKeyDown={(e) => preventClose && e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-purple-700 flex items-center gap-2">
                        {shouldUpdateData ? '📝 Atualização Obrigatória' : '✏️ Atualizar Meus Dados'}
                    </DialogTitle>
                    <DialogDescription>
                        {shouldUpdateData 
                            ? 'Para continuar acessando o portal, precisamos que você atualize seus dados cadastrais e sociais.' 
                            : 'Mantenha suas informações sempre atualizadas.'}
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Dados atualizados!</h3>
                        <p className="text-sm text-gray-500">
                            {shouldUpdateData ? 'Obrigado pela colaboração. Você será redirecionado em instantes.' : 'Suas informações foram salvas com sucesso.'}
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 py-4">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                                <Input
                                    id="data_nascimento"
                                    type="date"
                                    required
                                    value={formData.data_nascimento}
                                    onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Você trabalha?</Label>
                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant={formData.trabalha ? 'default' : 'outline'}
                                        className="flex-1 h-9"
                                        onClick={() => handleRadioChange('trabalha', true)}
                                    >
                                        Sim
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={!formData.trabalha ? 'default' : 'outline'}
                                        className="flex-1 h-9"
                                        onClick={() => handleRadioChange('trabalha', false)}
                                    >
                                        Não
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Mora com a família?</Label>
                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant={formData.mora_com_familia ? 'default' : 'outline'}
                                        className="flex-1 h-9"
                                        onClick={() => handleRadioChange('mora_com_familia', true)}
                                    >
                                        Sim
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={!formData.mora_com_familia ? 'default' : 'outline'}
                                        className="flex-1 h-9"
                                        onClick={() => handleRadioChange('mora_com_familia', false)}
                                    >
                                        Não
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 text-xs">
                                    <Label className="text-xs">Recebe Bolsa Família?</Label>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={formData.recebe_bolsa_familia ? 'default' : 'outline'}
                                            onClick={() => handleRadioChange('recebe_bolsa_familia', true)}
                                        >
                                            Sim
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={!formData.recebe_bolsa_familia ? 'default' : 'outline'}
                                            onClick={() => handleRadioChange('recebe_bolsa_familia', false)}
                                        >
                                            Não
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2 text-xs">
                                    <Label className="text-xs">Recebe Pé de Meia?</Label>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={formData.recebe_pe_de_meia ? 'default' : 'outline'}
                                            onClick={() => handleRadioChange('recebe_pe_de_meia', true)}
                                        >
                                            Sim
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={!formData.recebe_pe_de_meia ? 'default' : 'outline'}
                                            onClick={() => handleRadioChange('recebe_pe_de_meia', false)}
                                        >
                                            Não
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs">Usa transporte?</Label>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={formData.usa_transporte ? 'default' : 'outline'}
                                            onClick={() => handleRadioChange('usa_transporte', true)}
                                        >
                                            Sim
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={!formData.usa_transporte ? 'default' : 'outline'}
                                            onClick={() => handleRadioChange('usa_transporte', false)}
                                        >
                                            Não
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Tem Passe Livre?</Label>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={formData.tem_passe_livre ? 'default' : 'outline'}
                                            onClick={() => handleRadioChange('tem_passe_livre', true)}
                                        >
                                            Sim
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={!formData.tem_passe_livre ? 'default' : 'outline'}
                                            onClick={() => handleRadioChange('tem_passe_livre', false)}
                                        >
                                            Não
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endereco">Endereço Completo</Label>
                                <Input
                                    id="endereco"
                                    placeholder="Rua, número, bairro..."
                                    required
                                    value={formData.endereco}
                                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nome_responsavel">Nome do Responsável</Label>
                                <Input
                                    id="nome_responsavel"
                                    placeholder="Nome completo do familiar/responsável"
                                    required
                                    value={formData.nome_responsavel}
                                    onChange={(e) => setFormData({ ...formData, nome_responsavel: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tel_aluno">Seu Telefone</Label>
                                    <Input
                                        id="tel_aluno"
                                        placeholder="(99) 99999-9999"
                                        value={formData.telefone_aluno}
                                        onChange={(e) => setFormData({ ...formData, telefone_aluno: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tel">Telefone do Responsável</Label>
                                    <Input
                                        id="tel"
                                        placeholder="(99) 99999-9999"
                                        required
                                        value={formData.telefone_responsavel}
                                        onChange={(e) => setFormData({ ...formData, telefone_responsavel: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tel_resp_2">Telefone do Responsável 2</Label>
                                    <Input
                                        id="tel_resp_2"
                                        placeholder="(99) 99999-9999"
                                        value={formData.telefone_responsavel_2}
                                        onChange={(e) => setFormData({ ...formData, telefone_responsavel_2: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            {shouldUpdateData ? (
                                <Button type="button" variant="ghost" onClick={logout} disabled={loading}>
                                    Sair da conta
                                </Button>
                            ) : (
                                <Button type="button" variant="ghost" onClick={onCloseEdit} disabled={loading}>
                                    Cancelar
                                </Button>
                            )}
                            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                                {loading ? 'Salvando...' : (shouldUpdateData ? 'Atualizar e Entrar' : 'Salvar Alterações')}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
