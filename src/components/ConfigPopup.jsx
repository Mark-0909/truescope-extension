export default function ConfigPopup({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-64">
        <h1 className="text-xl font-bold mb-4 text-black">Configuration</h1>
        <p className="text-sm text-gray-600 mb-6">Settings will go here.</p>
        <button
          onClick={onClose}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}