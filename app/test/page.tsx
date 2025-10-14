export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-white">FU</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ECGMS Test Page</h1>
          <p className="text-gray-600 mb-6">Thiết kế giao diện đang hoạt động!</p>
          
          <div className="space-y-3">
            <a 
              href="/login" 
              className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Go to Login
            </a>
            
            <div className="grid grid-cols-2 gap-3">
              <a 
                href="/lecturer/dashboard" 
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-3 rounded-lg transition-colors text-sm"
              >
                Lecturer Dashboard
              </a>
              <a 
                href="/student/dashboard" 
                className="bg-green-100 hover:bg-green-200 text-green-800 font-medium py-2 px-3 rounded-lg transition-colors text-sm"
              >
                Student Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
