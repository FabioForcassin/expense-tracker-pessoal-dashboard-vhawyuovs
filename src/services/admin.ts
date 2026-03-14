import { supabase } from '@/lib/supabase/client'

export const inviteUser = async (email: string, role: string) => {
  const { data, error } = await supabase.functions.invoke('invite-user', {
    body: { email, role },
  })
  return { data, error }
}
