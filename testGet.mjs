import axios from 'axios';

async function test() {
  try {
    const res = await axios.get('http://localhost:5000/api/tasks/my');
    console.log("Success:", res.data);
  } catch (err) {
    if (err.response) {
      console.log("Error status:", err.response.status);
      console.log("Error data:", err.response.data);
    } else {
      console.log("Network error:", err.message);
    }
  }
}
test();
