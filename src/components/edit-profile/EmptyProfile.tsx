import { DashboardLayout } from "../DashboardLayout"
import { Step } from "../OnboardingProgress"
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom"

const EmptyProfile = ({ initialSteps }: { initialSteps: Step[] }) => {
  const navigate = useNavigate()

  return (
    <DashboardLayout steps={initialSteps} currentStep={3}>
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <div className="text-center">
        <p>No profile data found.</p>
        <p className="text-sm text-gray-600 mt-2">
          Please complete your profile creation first.
        </p>
        <Button
          onClick={() => navigate("/create-profile")}
          className="mt-4"
        >
          Go to Profile Creation
        </Button>
      </div>
    </div>
  </DashboardLayout>
  )
}

export default EmptyProfile