"use server"

import { supabaseServer } from '../lib/supabase-server'

export async function UploadAvatar(userId: string, file: File) {
    if (file.size > 5 * 1024 * 1024) {
        return {
            data: "",
            error: "A imagem deve ter no máximo 5MB.",
        }
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}.${fileExt}`

    const { error } = await supabaseServer.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

    if (error) throw error

    const { data } = supabaseServer.storage
        .from('avatars')
        .getPublicUrl(fileName)

    return {
            data: data.publicUrl,
            error: null,
        }
}
