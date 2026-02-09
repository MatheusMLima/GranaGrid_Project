'use client'

import { useState, useRef, useEffect } from 'react'
import { Settings, LogOut, CircleUserRound } from 'lucide-react'
import { PerfilModal } from './perfilModal'

type UserData = {
    id: string
    nome: string
    email: string
    username?: string
    image?: string
}

type Props = {
    userData: UserData
    signOut: () => void
}

export function MenuUsuario({ userData, signOut }: Props) {

    const [open, setOpen] = useState(false)
    const [openProfile, setOpenProfile] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const hasImage = userData.image === ""

    // fecha ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setOpen(false)
        }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen(!open)} className="h-10 w-10 mt-1.5 overflow-hidden rounded-full border border-slate-600 cursor-pointer">
                {
                    hasImage ? (<CircleUserRound size={20} />) : <img src={userData.image} alt={userData.nome} className='h-full w-full object-cover'/>
                }
            </button>

            {open && (
                <div className="absolute right-0 mt-3 w-64 rounded-xl bg-slate-800 shadow-xl border border-slate-700 p-4 z-50">
                
                    <div className="mb-3">
                        <p title={userData.nome} className="text-sm font-semibold text-white">{userData.nome.length >= 22 ? userData.nome.substring(0,22).concat("...") : userData.nome}</p>
                        <p title={userData.email} className="text-xs text-slate-400">{userData.email.length >= 27 ? userData.email.substring(0,27).concat("...") : userData.email}</p>
                    </div>

                    <div className="h-px bg-slate-700 my-2" />

                    <button onClick={() => setOpenProfile(true)} className="flex w-full items-center gap-2 rounded-lg py-2 text-sm text-slate-300 hover:bg-slate-700 transition cursor-pointer">
                        <Settings size={16} />
                        Configurações de Perfil
                    </button>

                    <button onClick={signOut} className="flex w-full items-center gap-2 rounded-lg py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition cursor-pointer">
                        <LogOut size={16} />
                        Sair da Conta
                    </button>
                </div>
            )}

            <PerfilModal open={openProfile} onClose={() => setOpenProfile(false)} user={userData}/>
        </div>
    )
    
}
