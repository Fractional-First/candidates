import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"

export function useSignUp() {
  const [loading, setLoading] = useState(false)

  const signUp = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { first_name: firstName, last_name: lastName },
        },
      })
      if (error) throw error
    } finally {
      setLoading(false)
    }
  }

  return { signUp, loading }
}
