'use client'

import { useRef, useState } from 'react'
import { X, Camera, User, AtSign, Mail, Save } from 'lucide-react'
import { CreateUsername, UpdateName, UpdateImage } from '../_actions/usuario'
import { UploadAvatar } from '../../../lib/uploadAvatar'
import { toast } from 'sonner'

type UserData = {
  id: string
  nome: string
  email: string
  username?: string
  image?: string
}

type Props = {
  open: boolean
  onClose: () => void
  user: UserData
}

export function PerfilModal({ open, onClose, user }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<null | string>(null)
  const [success, setSuccess] = useState<null | string>(null)
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState(user.email)
  const [nome, setNome] = useState(user.nome)
  const [username, setUsername] = useState(user.username)
  const [image, setImage] = useState(user.image)

  if (!open) return null

  async function submitAction(formData: FormData) {
    const username = formData.get("Username") as string
    const nome = formData.get("Nome") as string
    const img = formData.get("img") as File

    if (username === "" && nome === "" && (!img || img.size === 0)) {
      return
    }

    if (img && img.size > 0) {
      const imageUrl = await UploadAvatar(user.id, img)

      if (imageUrl.error) {
        setError(imageUrl.error)
        setVisible(true)
        setSuccess(null)
      } else {
        toast.promise(UpdateImage(imageUrl.data), {
          loading: 'Alterando imagem...',
          success: (data) => {
            if (data.success) {
              setError(null)
              setImage(data.data)
              onClose()
              return data.success
            } else {
              onClose()
              throw new Error(data.error!)
            }
          },
          error: (err) => {
            return err.message || 'Erro desconhecido ao alterar imagem.'
          }
        })

      }
    }

    if (username !== "" && username !== user.username) {
      toast.promise(CreateUsername({ username }), {
        loading: 'Alterando username...',
        success: (data) => {
          if (data.success) {
            setError(null)
            setUsername(data.data)
            onClose()
            return data.success
          } else {
            onClose()
            throw new Error(data.error!)
          }
        },
        error: (err) => {
          throw new Error(err.message || 'Erro desconhecido ao alterar username.')
        }
      })
    }

    if (nome !== "" && nome !== user.nome) {
      toast.promise(UpdateName({ nome }), {
        loading: 'Alterando nome...',
        success: (data) => {
          if (data.success) {
            setError(null)
            setNome(data.data)
            onClose()
            return data.success
          } else {
            onClose()
            throw new Error(data.error!)
          }
        },
        error: (err) => {
          throw new Error(err.message || 'Erro desconhecido ao alterar o nome.')
        }
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-slate-800 shadow-xl border border-slate-700">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <User size={40} className="text-blue-500 bg-blue-900 p-2 rounded-xl" />

            <div>
              <h2 className="text-lg font-semibold text-white">Perfil do Usuário</h2>
              <p className="text-sm text-slate-400">Atualize suas informações pessoais</p>
            </div>
          </div>

          <button onClick={() => {
            setError(null)
            setVisible(false)
            onClose()
          }}
            className="text-slate-400 hover:text-white cursor-pointer">
            <X />
          </button>
        </div>

        <form
          action={submitAction}
        >
          {/* Conteúdo */}
          <div className="p-6 space-y-5">

            {/* Avatar */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => fileRef.current?.click()}
                className="relative h-24 w-24 rounded-full overflow-hidden border border-slate-600 group cursor-pointer"
              >
                {image ? (
                  <img src={image} alt={nome} className='h-full w-full object-cover' />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-blue-600 text-2xl font-bold text-white">
                    {nome?.[0] ?? 'U'}
                  </div>
                )}

                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <Camera className="text-white" />
                </div>
              </button>

              <input ref={fileRef} type="file" accept="image/*" className="hidden" name='img' />
            </div>

            {/* Campos */}
            <div className="space-y-4">

              <Field icon={<User size={18} />} label="Nome" defaultValue={nome} desabilita={false} />
              <Field icon={<AtSign size={18} />} label="Username" defaultValue={username} desabilita={false} />
              <Field icon={<Mail size={18} />} label="E-mail" defaultValue={email} desabilita={true} />

            </div>

          </div>

          {/* Footer */}
          <div className="border-t border-slate-700 px-6 py-4">
            <div className="flex gap-3">
              <button onClick={() => {
                setError(null)
                setVisible(false)
                onClose()
              }}
                className="flex-1 rounded-lg bg-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-600 cursor-pointer">
                Cancelar
              </button>

              <button type='submit' className="flex-1 flex items-center gap-2 justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 cursor-pointer">
                <Save size={13} className="" /> Salvar Alterações
              </button>
            </div>

            {error && visible ?
              <p className="mt-2 text-center text-xs text-red-500">
                {error}
              </p> : visible ? <p className="mt-2 text-center text-xs text-green-500">
                {success}
              </p> : ""}
          </div>

        </form>
      </div>
    </div>
  )
}

function Field({ label, icon, defaultValue, desabilita }: { label: string; icon: React.ReactNode; defaultValue?: string; desabilita: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-sm text-slate-400">{label}</label>
      <div className="flex items-center gap-2 rounded-lg bg-slate-700 px-3 py-2">
        {icon}
        <input
          disabled={desabilita}
          defaultValue={defaultValue}
          className={`w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500 ${desabilita ? 'text-slate-500 cursor-not-allowed' : 'text-white'}`}
          name={label}
        />
      </div>
    </div>
  )
}
