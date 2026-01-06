import React, { useState, useEffect} from 'react';
import { supabase } from '../supabase-client';

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
    const [editId, setEditId] = useState(null);
    const [text, setText] = useState('');
    const [newDescription, setNewDescription] = useState("");
    const [newTitle, setNewTitle] = useState("");

    const [newTodo, setNewTodo] = useState({ title: "", text: "" });

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

  /*
   const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };*/

  const updateTodo = async (id) => {
    console.log("Update todo with id: ", id);
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
/*

    const addTodo = () => {
        if (title.trim()) {
            if (editId) {
                setTodos(todos.map(todo =>
                    todo.id === editId ? { ...todo, title, text } : todo
                ));
                setEditId(null);
            } else {
                setTodos([...todos, { id: Date.now(), title, text }]);
            }
            setTitle('');
            setText('');
        }
    };
*/ 
  
  const addTodo = async (e) => {
    e.preventDefault();

    /*
        const { error } = await supabase
      .from("todos")
    //  .insert({ ...newTodo, user_auth_id: session.user.id })
      .insert({ title, text })
      .select()
      .single();
    */ 
    if (editId) {
      const { data, error } = await supabase
        .from("todos")
        .update({ title, text })
        .eq("id", editId);

      if (error) {
        console.error("Error updating todo: ", error.message);
        return;
      }
      //setTodos(todos.map((t) => (t.id === editId ? { ...t, title, text } : t)));
      //setEditId(null);

      setTodos((prev) => [...prev, data]);
    } else {
      const { data, error } = await supabase
        .from("todos")
        .insert({ title, text, user_auth_id: session.user.id })
        .select()
        .single();

      if (error) {
        console.error("Error adding todo: ", error.message);
        return;
      }

      setTodos((prev) => [...prev, data]);
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
          setTodos((prev) => [...prev, newTodo]);
        }
      )
      .subscribe((status) => {
        console.log("Subscription: ", status);
      });
  }, []);

  console.log(todos);

  return (

        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Todo List</h1>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
                />
                <textarea
                    placeholder="Description"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
                />
                <button onClick={addTodo}>{editId ? 'Update' : 'Add'} Todo</button>
            </div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {todos.map(todo => (

                    <li key={todo.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                           
               <h3>{todo.title}</h3>
                <p>{todo.text}</p>
              
              <div>
                <textarea
                  placeholder="Updated title..."
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <textarea
                  placeholder="Updated description..."
                  onChange={(e) => setNewDescription(e.target.value)}
                />
                <button
                  style={{ padding: "0.5rem 1rem", marginRight: "0.5rem" }}
                  onClick={() => updateTodo(todo.id)}
                >
                  Edit
                </button>
                <button
                  style={{ padding: "0.5rem 1rem" }}
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