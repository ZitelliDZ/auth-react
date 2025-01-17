const getTokenFromCookies = () => {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(row => row.startsWith('token='));
  
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  };

  
export default getTokenFromCookies;