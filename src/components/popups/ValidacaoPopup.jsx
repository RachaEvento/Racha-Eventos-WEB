import { MdWarning } from "react-icons/md";

function ValidacaoPopup({ message, type = "warning", onClose }) {
 
  const colors = {
    warning: {
      bg: "#fef3c7", 
      text: "#92400e",
      iconBg: "#fbbf24", 
    },
    success: {
      bg: "#d1fae5", 
      text: "#065f46", 
      iconBg: "#10b981", 
    },
    error: {
      bg: "#fee2e2", 
      text: "#991b1b",
      iconBg: "#ef4444", 
    },
  };

  const color = colors[type] || colors.warning;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-lg p-6 w-full max-w-sm text-center relative mx-4 shadow-lg"
        style={{ backgroundColor: color.bg }}
      >
        <button
          className="absolute top-2 right-2 text-xl font-bold"
          style={{ color: color.text }}
          onClick={() => onClose && onClose()}
          aria-label="Fechar aviso"
        >
          &times;
        </button>

        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: color.iconBg }}
        >
          <MdWarning size={48} className="text-white" />
        </div>

        <p
          className="font-semibold text-lg"
          style={{ color: color.text, minHeight: "3rem" }}
        >
          {message}
        </p>

        <button
          className="mt-6 bg-[#264f57] hover:bg-[#3e8682] text-white px-6 py-2 rounded transition-opacity duration-200"
          onClick={() => onClose && onClose()}
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default ValidacaoPopup;
