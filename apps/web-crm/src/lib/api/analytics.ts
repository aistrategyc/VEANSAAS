
export async function fetchAnalytics<T>(endpoint: string): Promise<T> {
  const token = localStorage.getItem("token")

  if (!token) {
    throw new Error("Отсутствует токен авторизации")
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Ошибка ${response.status}: ${errorText}`)
    }

    return await response.json()
  } catch (error: any) {
    console.error("Ошибка запроса к API:", error)
    throw new Error(error?.message || "Ошибка запроса")
  }
}