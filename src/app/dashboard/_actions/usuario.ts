"use server"

import { error } from "console"
import { success, z } from "zod"
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from "next/cache"

const UpdateNameSchema = z.object({
    nome: z.string().max(15, "O nome pode ter no máximo 30 caracteres")
})
const CreateUsernameSchema = z.object({
    username: z.string().min(4, "O username precisa ter pelo menos 4 caracteres").max(15, "O username pode ter no máximo 15 caracteres")
})

type UpdateNameFormData = z.infer<typeof UpdateNameSchema>
type CreateUsernameFormData = z.infer<typeof CreateUsernameSchema>

export async function CreateUsername(data: CreateUsernameFormData) {

    const session = await auth();

    if(!session?.user){
        return {
            data: "",
            success: null,
            error: "Usuário não autenticado",
        }
    }

    const schema = CreateUsernameSchema.safeParse(data)

    if (!schema.success){
        return {
            data: "",
            success: null,
            error: schema.error.issues[0].message
        }
    }

    try
    {
        const userId = session.user.id

        await prisma.user.update({
            where:{
                id: userId
            },
            data: {
                username: data.username
            }
        })

        revalidatePath('/dashboard')

        return {
            data: data.username,
            success: "Username atualizado com sucesso!",
            error: null
        }
    } 
    catch (err)
    {
        return {
            data: "",
            success: null,
            error: "Falha ao atualizar o username"
        }
    }
}

export async function UpdateImage(data: string) {
    const session = await auth();

    if(!session?.user){
        return {
            data: "",
            success: null,
            error: "Usuário não autenticado",
        }
    }

    try
    {
        const userId = session.user.id

        await prisma.user.update({
            where:{
                id: userId
            },
            data: {
                image: data
            }
        })

        revalidatePath('/dashboard')

        return {
            data: data,
            success: "Imagem atualizada com sucesso!",
            error: null
        }
    } 
    catch (err)
    {
        return {
            data: "",
            success: null,
            error: "Falha ao atualizar a imagem de perfil."
        }
    }
}

export async function UpdateName(data: UpdateNameFormData) {
    const session = await auth();

    if(!session?.user){
        return {
            data: "",
            success: null,
            error: "Usuário não autenticado",
        }
    }

    const schema = UpdateNameSchema.safeParse(data)

    if (!schema.success){
        return {
            data: "",
            success: null,
            error: schema.error.issues[0].message
        }
    }

    try
    {
        const userId = session.user.id

        await prisma.user.update({
            where:{
                id: userId
            },
            data: {
                name: data.nome
            }
        })

        revalidatePath('/dashboard')

        return {
            data: data.nome,
            success: "Nome atualizado com sucesso!",
            error: null
        }
    } 
    catch (err)
    {
        return {
            data: "",
            success: null,
            error: "Falha ao atualizar o nome."
        }
    }
}