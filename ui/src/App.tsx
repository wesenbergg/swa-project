function App() {
  return (
    <main>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" required />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <input type="text" id="description" name="description" />
        </div>

        <div>
          <label htmlFor="date">Date</label>
          <input type="date" id="date" name="date" required />
        </div>

        <div>
          <label htmlFor="location">Location</label>
          <input type="text" id="location" name="location" />
        </div>

        <button type="submit">Create Event</button>
      </form>
    </main>
  );
}

export default App;
