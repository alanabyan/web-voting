const getWinners = async () => {
  try {
    const response = await fetch("http://localhost:8000/vote/winner", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return data.winners
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export default getWinners;
