import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"

export function useSignIn() {
  const [loading, setLoading] = useState(false)

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    } finally {
      setLoading(false)
    }
  }

  return { signIn, loading }
}
