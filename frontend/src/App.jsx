import FeedbackForm from "./components/FeedbackForm"
import FeedbackList from "./components/FeedbackList"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Feedback System</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FeedbackForm />
          <FeedbackList />
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  )
}

export default App
