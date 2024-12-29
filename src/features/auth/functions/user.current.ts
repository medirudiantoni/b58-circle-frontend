import Cookies from "js-cookie";
import { getCurrentUser } from "../services/auth-service";

export default async function retrieveCurrentUser(setUserData: Function, setUser: Function) {
    const token = Cookies.get('token');
    try {
        if (token) {
            const currentUser = await getCurrentUser(token);
            setUserData(currentUser.data);
            setUser(currentUser.user)
        } else {
            throw new Error('Invalid token')
        };
    } catch (error) {
        console.log(error)
    }
};