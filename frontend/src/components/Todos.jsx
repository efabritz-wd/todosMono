import { useState, useEffect } from 'react';
import { supabase } from '../supabase-client';
import '../todos.css';

/**
 * @typedef {Object} Todos
 * @property {number} id
 * @property {string} created_at
 * @property {string} title
 * @property {string} text
 */

/**
 * @param {{ session: Session }} props
 */
export default function Todos({ session }) {

  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [newDescription, setNewDescription] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const fetchTodos = async () => {
    const { error, data } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching todo: ", error.message);
      return;
    }

    setTodos(data);
  };

  const deleteTodo = async (id) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.error("Error deleting todo: ", error.message);
      return;
    }

    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const updateTodo = async (id) => {
    let updateData = {};
    if (newTitle.trim()) updateData.title = newTitle;
    if (newDescription.trim()) updateData.text = newDescription;

    if (Object.keys(updateData).length === 0) {
      alert("No changes to update");
      return;
    }

    const { error } = await supabase
      .from("todos")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Error updating todo: ", error.message);
      return;
    }

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, ...updateData }
          : todo
      )
    );
    setNewTitle("");
    setNewDescription("");
  };

  const addTodo = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("todos")
      .insert({ title, text, user_auth_id: session.user.id })
      .select()
      .single();

    if (error) {
      console.error("Error adding todo: ", error.message);
      return;
    }

    if (data) {
      setTodos((prev) => {
        // Prevent duplicate if real-time already added it
        if (prev.some((t) => t.id === data.id)) return prev;
        return [...prev, data];
      });
    }
    setTitle("");
    setText("");
  };


  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    const channel = supabase.channel("todos-channel");
    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "todos" },
        (payload) => {
          const newTodo = payload.new;
          setTodos((prev) => {
            if (prev.some((todo) => todo.id === newTodo.id)) return prev;
            return [...prev, newTodo];
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "todos" },
        (payload) => {
          const updatedTodo = payload.new;
          setTodos((prev) =>
            prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "todos" },
        (payload) => {
          const deletedId = payload.old.id;
          setTodos((prev) => prev.filter((todo) => todo.id !== deletedId));
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  console.log(todos);

  return (
    <div className="container">
      <div className="header-container">
        <h1 className="header">Todo List</h1>
      </div>
      <div className="form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
        />
        <textarea
          placeholder="Description"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="textarea"
        />
        <button onClick={addTodo} className="add-button">Add Todo
        </button>
      </div>
      <ul className="list">
        {todos.map(todo => (
          <li key={todo.id} className="item">
            <h3 className="item-title">{todo.title}</h3>
            <p className="item-text">{todo.text}</p>
            <div className="actions">
              <textarea
                placeholder="Updated title..."
                onChange={(e) => setNewTitle(e.target.value)}
                className="edit-input"
              />
              <textarea
                placeholder="Updated description..."
                onChange={(e) => setNewDescription(e.target.value)}
                className="edit-input"
              />
              <button
                className="edit-button"
                onClick={() => updateTodo(todo.id)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}