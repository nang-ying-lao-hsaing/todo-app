import { useEffect, useState } from "react";
import { MdOutlineDone } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClipboardOutline } from "react-icons/io5";
import axios from "axios";

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post("/api/todos", { text: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.log("Error adding todo:", error);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get("/api/todos");
      setTodos(response.data);
    } catch (error) {
      console.log("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.patch(`/api/todos/${id}`, {
        text: editedText,
      });
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
      setEditingTodo(null);
    } catch (error) {
      console.log("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.log("Error deleting todo:", error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      const response = await axios.patch(`/api/todos/${id}`, {
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t._id === id ? response.data : t)));
    } catch (error) {
      console.log("Error toggling todo:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-purple-100 to-yellow-100 p-6">
      {/* Header */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 text-gray-800 drop-shadow-sm tracking-wide text-center">
        ✨ Task Manager
      </h1>

      {/* Add Todo Form */}
      <form
        onSubmit={addTodo}
        className="flex flex-col sm:flex-row gap-2 mb-8 w-full max-w-md"
      >
        <input
          className="flex-1 px-4 py-3 rounded-2xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-400 focus:outline-none text-gray-700 placeholder-gray-400 w-full"
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          required
        />
        <button
          type="submit"
          className="px-5 py-3 rounded-2xl bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700 transition w-full sm:w-auto"
        >
          Add Task
        </button>
      </form>

      {/* Todo List */}
      <div className="w-full max-w-md space-y-3">
        {todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-400 py-12">
            <IoClipboardOutline className="text-6xl mb-3" />
            <p className="text-lg font-medium">No tasks yet</p>
            <p className="text-sm">Add your first task above 👆</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div key={todo._id}>
              {editingTodo === todo._id ? (
                <div className="flex items-center gap-x-3 bg-gradient-to-r from-purple-50 to-yellow-50 p-4 rounded-xl shadow-sm">
                  <input
                    className="flex-1 p-3 border rounded-lg border-gray-200 outline-none focus:ring-2 focus:ring-purple-300 text-gray-700 shadow-inner"
                    type="text"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-x-2">
                    <button
                      onClick={() => saveEdit(todo._id)}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer transition"
                    >
                      <MdOutlineDone />
                    </button>
                    <button
                      className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer transition"
                      onClick={() => setEditingTodo(null)}
                    >
                      <IoClose />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-yellow-50 p-4 rounded-xl shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-x-3 overflow-hidden">
                    <button
                      onClick={() => toggleTodo(todo._id)}
                      className={`flex-shrink-0 h-5 w-5 rounded flex items-center justify-center transition ${
                        todo.completed
                          ? "bg-purple-600 text-white"
                          : "border border-gray-300 hover:border-purple-400"
                      }`}
                    >
                      {todo.completed && <MdOutlineDone />}
                    </button>
                    <span
                      className={`text-lg font-medium truncate ${
                        todo.completed
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {todo.text}
                    </span>
                  </div>
                  <div className="flex gap-x-2">
                    <button
                      className="p-2 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition"
                      onClick={() => startEditing(todo)}
                    >
                      <MdModeEditOutline />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
