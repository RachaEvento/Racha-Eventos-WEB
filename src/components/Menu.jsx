import React, { useState } from "react";
import {
    FiMenu,
    FiX,
    FiCalendar,
    FiPhone,
    FiSettings,
    FiLogOut,
    FiMapPin, // Ícone correto para Locais
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const Menu = ({ children }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleNavigate = (route) => {
        toggleMenu();
        navigate(route);        
    }

    const getUserNameFromToken = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        
        try {
            const decoded = jwtDecode(token);
            return decoded.name || null;
        } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
    }
    return (
        <div className="font-inter text-white">
            {/* Menu Mobile */}
            <div className="md:hidden fixed top-0 left-0 w-full z-50 bg-[#56C7B2] rounded-b-2xl shadow-lg">
                <div className="flex items-center justify-between p-4">
                    <button onClick={handleLogout} className="text-2xl hover:text-red-200">
                        <FiLogOut />
                    </button>
                    <img
                        src="/logo-white-nobk-line.png"
                        alt="Logo"
                        className="h-6"
                    />
                    <button onClick={toggleMenu} className="text-2xl">
                        {menuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>

                {menuOpen && (
                    <div className="px-6 pb-6 pt-2 flex flex-col gap-3 transition-all duration-300 ease-in-out">
                        <div className="text-center text-sm font-medium text-white mb-2">
                            Olá, <span className="font-semibold">{getUserNameFromToken()}</span>
                        </div>

                        <hr className="border-white/40" />

                        <button 
                            onClick={() => handleNavigate("/eventos")}
                            className="bg-white text-[#56C7B2] font-semibold py-3 rounded-xl hover:brightness-110 transition flex items-center gap-3 px-4 shadow">
                            <FiCalendar />
                            Eventos
                        </button>

                        <button
                            onClick={() => handleNavigate("/contatos")}
                            className="bg-white text-[#56C7B2] font-semibold py-3 rounded-xl hover:brightness-110 transition flex items-center gap-3 px-4 shadow"
                        >
                            <FiPhone />
                            Contatos
                        </button>

                        <button
                            onClick={() => handleNavigate("/locais")}
                            className="bg-white text-[#56C7B2] font-semibold py-3 rounded-xl hover:brightness-110 transition flex items-center gap-3 px-4 shadow"
                        >
                            <FiMapPin />
                            Locais
                        </button>

                        <hr className="border-white/40 mt-2" />

                        <button
                            onClick={() => handleNavigate("/configuracoes")}
                            className="text-white py-3 px-4 hover:text-gray-200 transition flex items-center gap-3">
                            <FiSettings />
                            Configurações
                        </button>

                        <button
                            onClick={handleLogout}
                            className="text-white py-3 px-4 hover:bg-red-500 hover:text-white transition flex items-center gap-3 rounded-lg"
                        >
                            <FiLogOut />
                            Sair
                        </button>
                    </div>
                )}
            </div>

            {/* Menu Desktop */}
            <div className="hidden md:flex md:flex-col md:fixed md:left-0 md:top-0 md:h-screen md:w-72 bg-[#56C7B2] p-6 shadow-xl rounded-r-3xl justify-between z-40">
                <div>
                    <img
                        src="/logo-white-nobk.png"
                        alt="Logo"
                        className="w-full"
                    />
                    <p className="text-lg text-center mb-4">
                        Olá, <span className="font-semibold">{getUserNameFromToken()}</span>
                    </p>

                    <div className="flex flex-col gap-4 mt-4">
                        <button 
                            onClick={() => navigate("/eventos")}
                            className="bg-white text-[#56C7B2] font-semibold py-3 px-5 rounded-xl hover:brightness-110 transition flex items-center gap-3 shadow">
                            <FiCalendar />
                            Eventos
                        </button>

                        <button
                            onClick={() => navigate("/contatos")}
                            className="bg-white text-[#56C7B2] font-semibold py-3 px-5 rounded-xl hover:brightness-110 transition flex items-center gap-3 shadow"
                        >
                            <FiPhone />
                            Contatos
                        </button>                        

                        <button
                            onClick={() => navigate("/locais")}
                            className="bg-white text-[#56C7B2] font-semibold py-3 px-5 rounded-xl hover:brightness-110 transition flex items-center gap-3 shadow"
                        >
                            <FiMapPin />
                            Locais
                        </button>
                    </div>
                </div>

                <div onClick={() => navigate("/configuracoes")}
                     className="flex flex-col gap-3">
                    <button className="text-white py-3 px-5 hover:text-gray-200 transition flex items-center gap-3">
                        <FiSettings />
                        Configurações
                    </button>

                    <button
                        onClick={handleLogout}
                        className="text-white py-3 px-5 hover:bg-red-500 hover:text-white transition flex items-center gap-3 rounded-lg"
                    >
                        <FiLogOut />
                        Sair
                    </button>
                </div>
            </div>

            <div className="md:ml-72 md:mt-0 mt-12 ">
                {children}
            </div>
        </div>
    );
};

export default Menu;
