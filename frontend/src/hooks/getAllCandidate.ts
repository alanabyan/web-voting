export async function getData() {
  try {
    const result = await fetch("http://localhost:8000/candidates", {
      method: "GET",
      credentials: "include",
    });

    return await result.json();
  } catch (error) {
    console.error("Failed to fetch candidates:", error);
  }
}
