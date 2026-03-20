import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
    Home, 
    Megaphone, 
    MessageSquare, 
    Briefcase,
    LogOut,
    User
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function PortalLayout() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { label: 'Início', path: '/', icon: Home },
        { label: 'Avisos', path: '/avisos', icon: Megaphone },
        { label: 'Suporte', path: '/suporte', icon: MessageSquare },
        { label: 'Estágios', path: '/estagios', icon: Briefcase },
        { label: 'Perfil', path: '/meus-dados', icon: User },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pb-20 sm:pb-0 sm:pl-64">
            {/* Sidebar Desktop */}
            <aside className="hidden sm:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 z-30">
                <div className="p-6">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Portal Aluno
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Chamada Diária</p>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                                    isActive 
                                        ? "bg-purple-50 text-purple-700 shadow-sm shadow-purple-100" 
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5", isActive ? "text-purple-600" : "text-gray-400")} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-medium text-sm"
                    >
                        <LogOut className="h-5 w-5" />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 max-w-5xl mx-auto w-full">
                <Outlet />
            </main>

            {/* Bottom Nav Mobile */}
            <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 h-16 flex items-center justify-around px-2 z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={cn(
                                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-300",
                                isActive ? "text-purple-600 scale-105" : "text-gray-400"
                            )}
                        >
                            <div className={cn(
                                "p-1.5 rounded-lg transition-colors",
                                isActive ? "bg-purple-100" : "bg-transparent"
                            )}>
                                <item.icon className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
