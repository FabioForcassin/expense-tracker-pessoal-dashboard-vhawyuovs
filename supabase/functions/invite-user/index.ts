import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  // 1. Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
    // 2. Setup Supabase Admin Client with Service Role Key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables.')
      return new Response(
        JSON.stringify({ error: 'Erro de configuração: Variáveis de ambiente ausentes.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // 3. Parse JSON safely to prevent crashing on empty/invalid body
    let body
    try {
      body = await req.json()
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Payload JSON inválido fornecido.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { email, role } = body

    if (!email) {
      return new Response(JSON.stringify({ error: 'E-mail é obrigatório.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 4. Perform the invite via Supabase Admin API
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email)

    if (error) {
      console.error('Error inviting user:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 5. Update profile role if provided and user was created
    if (data?.user?.id && role) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', data.user.id)

      if (profileError) {
        console.error('Error updating profile role:', profileError)
        // Return 200 anyway since the invite succeeded, but include a warning
        return new Response(
          JSON.stringify({
            data,
            warning:
              'Usuário convidado com sucesso, mas houve falha ao definir a permissão de administrador.',
            profileError: profileError.message,
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }
    }

    // 6. Return standard success
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Unexpected edge function error:', error)
    return new Response(JSON.stringify({ error: 'Erro interno no servidor: ' + error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
