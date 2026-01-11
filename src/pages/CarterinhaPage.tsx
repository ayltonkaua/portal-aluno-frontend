/**
 * Carteirinha Page
 * 
 * Digital student ID card.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { portalApi, StudentData, EscolaInfo } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, QrCode, GraduationCap } from 'lucide-react';

export function CarterinhaPage() {
    const [student, setStudent] = useState<StudentData | null>(null);
    const [escola, setEscola] = useState<EscolaInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetch() {
            setLoading(true);
            const [meRes, escRes] = await Promise.all([
                portalApi.getMe(),
                portalApi.getEscola(),
            ]);
            if (meRes.success && meRes.data) setStudent(meRes.data);
            if (escRes.success && escRes.data) setEscola(escRes.data);
            setLoading(false);
        }
        fetch();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
                <Skeleton className="h-96 w-72 rounded-3xl" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700">
            {/* Header */}
            <header className="px-4 py-3 flex items-center gap-3">
                <Link to="/">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h1 className="font-bold text-lg text-white">Carteirinha Digital</h1>
            </header>

            <main className="p-4 flex justify-center items-center min-h-[80vh]">
                <div className="w-full max-w-[320px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 animate-slide-in">
                    {/* Card Header */}
                    <div
                        className="p-6 text-center text-white relative overflow-hidden"
                        style={{
                            background: `linear-gradient(135deg, ${escola?.cor_primaria || '#6D28D9'}, ${escola?.cor_secundaria || '#4F46E5'})`,
                        }}
                    >
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                        <h3 className="font-bold text-lg relative z-10">
                            {escola?.nome || 'Escola Digital'}
                        </h3>
                        <p className="text-xs opacity-80 relative z-10 uppercase tracking-widest mt-1">
                            Identidade Estudantil
                        </p>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex flex-col items-center gap-5">
                        {/* Avatar */}
                        <div className="h-28 w-28 rounded-full bg-gray-100 border-4 border-white shadow-lg -mt-20 overflow-hidden flex items-center justify-center relative z-10">
                            <GraduationCap size={48} className="text-purple-300" />
                        </div>

                        {/* Info */}
                        <div className="text-center space-y-1">
                            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                                {student?.nome}
                            </h2>
                            <p className="text-sm font-medium text-purple-600">{student?.turma}</p>
                            <p className="text-xs text-gray-400">
                                Matrícula: {student?.matricula}
                            </p>
                        </div>

                        {/* QR Code */}
                        <div className="bg-white p-3 rounded-xl border-2 border-dashed border-gray-200 w-full flex justify-center">
                            <QrCode className="h-32 w-32 text-gray-800" />
                        </div>

                        {/* Status */}
                        <div className="w-full bg-green-50 text-green-700 text-xs py-2 rounded-lg text-center font-medium">
                            ● Documento Ativo
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
