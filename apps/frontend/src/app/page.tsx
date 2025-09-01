import HelloForm from "@/components/HelloForm";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Monorepo POC</h1>
          <p className="text-gray-600">
            A demonstration of shared validation across frontend and backend
          </p>
        </div>

        <HelloForm />

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            This form uses shared Zod schemas for validation.
            <br />
            Try typing &quot;hello&quot; to see it in action!
          </p>
        </div>
      </div>
    </div>
  );
}
