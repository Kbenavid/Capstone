import React from 'react'; // Import React to use JSX and create components
import PartsList from './components/PartsList'; // Import the PartsList component you created

// Define the main App component as a function
function App() {
  return (
    <div className="App"> {/* A container div with className "App" */}
      <PartsList /> {/* Render the PartsList component inside this container */}
    </div>
  );
}

export default App; // Export the App component to be used by ReactDOM in index.js

