import { supabase } from '@/lib/supabase/client'

export const inviteUser = async (email: string, role: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('invite-user', {
      body: { email, role },
    })

    if (error) {
      console.error('Error invoking invite-user edge function:', error)

      let errorMessage = error.message || 'Falha ao comunicar com o servidor.'

      // Handle FunctionsHttpError to extract the real error message sent by the Edge Function
      if (error.name === 'FunctionsHttpError' || error.message?.includes('non-2xx')) {
        try {
          // Attempt to parse the Response context if available to get the JSON payload
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

      return { data: null, error: { message: errorMessage } }
    }

    return { data, error: null }
  } catch (err: any) {
    console.error('Unexpected catch error in inviteUser service:', err)
    return { data: null, error: { message: err.message || 'Erro inesperado ao convidar usuário.' } }
  }
}
