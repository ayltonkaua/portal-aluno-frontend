/**
 * Boletim Page
 * 
 * Shows student grades organized by subject.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { portalApi, BoletimData } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, GraduationCap, Trophy, AlertTriangle } from 'lucide-react';

export function BoletimPage() {
    const [boletim, setBoletim] = useState<BoletimData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetch() {
            setLoading(true);
            const res = await portalApi.getBoletim();
            if (res.success && res.data) setBoletim(res.data);
            setLoading(false);
        }
        fetch();
    }, []);

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
                    <GraduationCap className="h-5 w-5 text-pink-600" />
                    <h1 className="font-bold text-lg">Boletim Escolar</h1>
                </div>
            </header>

            <main className="p-4 max-w-lg mx-auto">
                {!boletim || boletim.disciplinas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-white rounded-xl border border-dashed">
                        <AlertTriangle className="h-10 w-10 mb-2 opacity-20" />
                        <p className="text-sm font-medium">Boletim indisponível</p>
                        <p className="text-xs">Nenhuma nota registrada ainda.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left p-3 font-semibold text-gray-700">
                                        Disciplina
                                    </th>
                                    <th className="text-center p-3 font-medium text-gray-600">
                                        1º Tri
                                    </th>
                                    <th className="text-center p-3 font-medium text-gray-600">
                                        2º Tri
                                    </th>
                                    <th className="text-center p-3 font-medium text-gray-600">
                                        3º Tri
                                    </th>
                                    <th className="text-right p-3 font-bold text-gray-800">
                                        Média
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {boletim.disciplinas.map((disc) => {
                                    const getNota = (sem: number) =>
                                        disc.notas.find((n) => n.semestre === sem)?.valor;

                                    return (
                                        <tr
                                            key={disc.id}
                                            className="border-b last:border-0 hover:bg-gray-50"
                                        >
                                            <td className="p-3 font-medium text-gray-800">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ backgroundColor: disc.cor }}
                                                    />
                                                    {disc.nome}
                                                </div>
                                            </td>
                                            {[1, 2, 3].map((sem) => {
                                                const nota = getNota(sem);
                                                return (
                                                    <td key={sem} className="text-center p-3">
                                                        {nota !== undefined ? (
                                                            <span
                                                                className={
                                                                    nota < 6
                                                                        ? 'text-red-500 font-medium'
                                                                        : 'text-gray-700'
                                                                }
                                                            >
                                                                {nota.toFixed(1)}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-300">-</span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                            <td className="text-right p-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <span
                                                        className={`font-bold ${disc.media >= 6
                                                                ? 'text-green-600'
                                                                : 'text-red-600'
                                                            }`}
                                                    >
                                                        {disc.media.toFixed(1)}
                                                    </span>
                                                    {disc.media >= 9 && (
                                                        <Trophy className="h-3 w-3 text-yellow-500" />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
