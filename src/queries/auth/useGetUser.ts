import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function useGetUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error) throw error
        return data.user
      } catch (error) {
        console.error("Error fetching user:", error)
        throw error
      }
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })
}
