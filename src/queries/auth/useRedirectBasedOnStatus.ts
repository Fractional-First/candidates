import { supabase } from "@/integrations/supabase/client"

export function useRedirectBasedOnStatus() {
  return async (user, navigate, queryClient) => {
    try {
      if (user.email_confirmed_at) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_status")
          .eq("id", user.id)
          .single()
        const currentStatus = profile?.onboarding_status
        switch (currentStatus) {
          case "EMAIL_CONFIRMED":
            navigate("/create-profile")
            break
          case "PROFILE_GENERATED":
            navigate("/edit-profile")
            break
          case "PROFILE_CONFIRMED":
          case "PREFERENCES_SET":
            navigate("/dashboard")
            break
          default:
            navigate("/create-profile")
        }
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error)
      navigate("/create-profile")
    }
  }
}
