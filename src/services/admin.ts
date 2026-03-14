import { supabase } from '@/lib/supabase/client'

export const inviteUser = async (email: string, role: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('invite-user', {
      body: { email, role },
    })

    if (error) {
      console.error('Error invoking invite-user edge function:', error)
      let errorMessage = error.message || 'Falha ao comunicar com o servidor.'

      if (error.name === 'FunctionsHttpError' || error.message?.includes('non-2xx')) {
        try {
          const context = (error as any).context
          if (context && typeof context.json === 'function') {
            const errorBody = await context.json()
            if (errorBody?.error) {
              errorMessage = errorBody.error
            }
          }
        } catch (parseError) {
          console.error('Failed to parse error body:', parseError)
        }
      }

      if (
        errorMessage.toLowerCase().includes('already been registered') ||
        errorMessage.toLowerCase().includes('já registrado')
      ) {
        errorMessage = 'Já existe um usuário registrado com este e-mail.'
      }

      return { data: null, error: { message: errorMessage } }
    }

    if (data?.error) {
      let em = data.error
      if (em.toLowerCase().includes('already been registered')) {
        em = 'Já existe um usuário registrado com este e-mail.'
      }
      return { data: null, error: { message: em } }
    }

    return { data, error: null }
  } catch (err: any) {
    let msg = err.message || 'Erro inesperado ao convidar usuário.'
    if (msg.toLowerCase().includes('already been registered')) {
      msg = 'Já existe um usuário registrado com este e-mail.'
    }
    return { data: null, error: { message: msg } }
  }
}

export const deleteUser = async (userId: string) => {
  const { data, error } = await supabase.functions.invoke('manage-user', {
    body: { action: 'delete', userId },
  })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
  return data
}

export const toggleUserStatus = async (userId: string, isActive: boolean) => {
  const { data, error } = await supabase.functions.invoke('manage-user', {
    body: { action: 'toggle_status', userId, isActive },
  })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
  return data
}
