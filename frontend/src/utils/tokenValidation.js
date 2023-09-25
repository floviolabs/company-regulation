import jwt_decode from 'jwt-decode';
const currentTime = Date.now() / 1000;

const TokenValidation = (token) => {
  try
  {
    const decodedToken = jwt_decode(token);
    try {
      if (decodedToken.exp < currentTime) {
        return false
      } else {
        return true
      }
    } catch (error) {
      return false;
    }
  }catch (error){
    return false;
  }
 
}

export default TokenValidation;
