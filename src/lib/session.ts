// Session management
const SESSION_KEY = 'skyguide_session';

export function persistSession() {
  try {
    const sessionData = {
      authenticated: true,
      timestamp: Date.now()
    };
    
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      ...sessionData,
      expiry: expiry.toISOString()
    }));
    
  } catch (error) {
    console.error('Error persisting session:', error);
  }
}

export function checkSession(): boolean {
  try {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return false;
    
    const session = JSON.parse(sessionStr);
    if (!session.authenticated || !session.expiry) {
      clearSession();
      return false;
    }
    
    // Check if session has expired
    if (new Date(session.expiry) < new Date()) {
      clearSession();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking session:', error);
    clearSession();
    return false;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('session_expiry');
}