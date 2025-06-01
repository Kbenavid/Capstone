import React, { useEffect, useState } from 'react'; // Import React and hooks: useEffect for side effects, useState for state management

const PartsList = () => { // Define PartsList component as a function
  const [parts, setParts] = useState([]); // Declare 'parts' state initialized as empty array, with setter 'setParts'

  useEffect(() => { // useEffect runs after component mounts
    fetch('http://localhost:5000/api/parts') // Make GET request to backend API to get parts data
      .then(res => res.json()) // Parse response as JSON
      .then(data => setParts(data)) // Set 'parts' state to the fetched data
      .catch(err => console.error('Error fetching parts:', err)); // Log errors if fetch fails
  }, []); // Empty dependency array means this effect runs only once on mount

  return (
    <div className="p-4"> {/* Container div with padding using Tailwind CSS */}
      <h1 className="text-xl font-bold mb-4">Parts Inventory</h1> {/* Heading with Tailwind styles */}
      <ul> {/* Unordered list to display parts */}
        {parts.length === 0 ? ( // If parts array is empty
          <li>No parts found.</li> // Show message
        ) : ( // Otherwise
          parts.map(part => ( // Map over each part in the array
            <li key={part._id} className="mb-2 border p-2 rounded"> {/* List item with styling, key is unique id */}
              <strong>{part.name}</strong> — Qty: {part.quantity} — Price: ${part.price.toFixed(2)} {/* Display part details */}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default PartsList; // Export component so it can be imported elsewhere
