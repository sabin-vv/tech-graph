const TOKEN_KEY = "tech-graph"

export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}
