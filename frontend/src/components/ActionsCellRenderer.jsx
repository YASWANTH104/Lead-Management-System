import { useNavigate } from "react-router-dom";
const ActionsCellRenderer = (props) => {
  const navigate = useNavigate();

  const handleView = () => navigate(`/leads/view/${props.value}`);
  const handleEdit = () => navigate(`/leads/edit/${props.value}`);
  
  const handleDelete = () => props.deleteLead(props.value);

  return (
    <div className="flex gap-4">
      <button onClick={handleView} className="bg-blue-500 text-white px-2 py-1 h-3/4 rounded">
        View
      </button>
      <button onClick={handleEdit} className="bg-yellow-500 text-white px-2 py-1 rounded">
        Edit
      </button>
      <button onClick={handleDelete} className="bg-red-500 text-white px-2 py-1 rounded">
        Delete
      </button>
    </div>
  );
};

export default ActionsCellRenderer;