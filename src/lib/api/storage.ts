export function saveOffline(key: string, data: any) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving offline data:', error)
  }
}

export function loadOffline(key: string) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error loading offline data:', error)
    return null
  }
}

export function removeOffline(key: string) {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing offline data:', error)
  }
}