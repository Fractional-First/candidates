import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"

export function useSignOut() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Clear all auth-related queries
      queryClient.removeQueries({ queryKey: ["user"] })
      queryClient.removeQueries({ queryKey: ["profile"] })

      // Small delay to ensure auth state is updated
      await new Promise((resolve) => setTimeout(resolve, 100))

      navigate("/login")
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setLoading(false)
    }
  }

  return { signOut, loading }
}
