export default function SuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-md p-10 text-center max-w-md">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold mb-2">Registration Complete!</h1>
        <p className="text-gray-500">
          Your payment was successful and you are now a registered agent.
          Check your email for confirmation.
        </p>
      </div>
    </main>
  );
}