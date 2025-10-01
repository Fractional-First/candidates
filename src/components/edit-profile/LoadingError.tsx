import { DashboardLayout } from "../DashboardLayout"
import { Step } from "../OnboardingProgress"

const LoadingError = ({
  initialSteps,
  error,
}: {
  initialSteps: Step[]
  error: Error
}) => (
  <DashboardLayout steps={initialSteps} currentStep={3}>
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <div className="text-center text-red-600">
        <p>Error loading profile. Please try again.</p>
        <p className="text-sm mt-2">Error: {error.message}</p>
      </div>
    </div>
  </DashboardLayout>
)

export default LoadingError
