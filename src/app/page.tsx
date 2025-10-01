import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Fractional First Public Profiles
        </h1>
        <p className="text-gray-600 mb-8">
          View professional fractional executive profiles
        </p>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            To view a profile, visit: <code>/profile/[slug]</code>
          </p>
          <p className="text-sm text-gray-500">
            For preview mode:{" "}
            <code>/profile/[slug]?uuid=[id]&new_profile=true</code>
          </p>
        </div>
        <div className="mt-8">
          <Link
            href="https://fractionalfirst.com"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
          >
            Visit Fractional First
          </Link>
        </div>
      </div>
    </div>
  )
}
