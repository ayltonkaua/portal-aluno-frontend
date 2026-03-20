/**
 * App Component
 * 
 * Main application with routing and auth protection.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Pages
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { HomePage } from '@/pages/HomePage';
import { BoletimPage } from '@/pages/BoletimPage';
import { AtestadosPage } from '@/pages/AtestadosPage';
import { MeusDadosPage } from '@/pages/MeusDadosPage';
import { CarterinhaPage } from '@/pages/CarterinhaPage';
import { AvisosPage } from '@/pages/AvisosPage';
import { EstagiosPage } from '@/pages/EstagiosPage';
import { SuportePage } from '@/pages/SuportePage';
import { PortalLayout } from '@/components/PortalLayout';
import { DataUpdateModal } from '@/components/DataUpdateModal';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

// Public Route (redirect if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

function AppRoutes() {
    return (
        <>
            <DataUpdateModal />
            <Routes>
                {/* Public Auth Pages */}
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <RegisterPage />
                    </PublicRoute>
                }
            />
            <Route
                path="/forgot-password"
                element={
                    <PublicRoute>
                        <ForgotPasswordPage />
                    </PublicRoute>
                }
            />
            <Route
                path="/reset-password"
                element={<ResetPasswordPage />}
            />

            {/* Protected */}
            <Route element={<ProtectedRoute><PortalLayout /></ProtectedRoute>}>
                <Route path="/" element={<HomePage />} />
                <Route path="/boletim" element={<BoletimPage />} />
                <Route path="/atestados" element={<AtestadosPage />} />
                <Route path="/meus-dados" element={<MeusDadosPage />} />
                <Route path="/carteirinha" element={<CarterinhaPage />} />
                <Route path="/avisos" element={<AvisosPage />} />
                <Route path="/suporte" element={<SuportePage />} />
                <Route path="/estagios" element={<EstagiosPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}

