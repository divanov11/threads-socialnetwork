import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { account, COLLECTION_ID_PROFILES, database, DEV_DB_ID } from "../appwriteConfig";

const AuthContext = createContext()

export const AuthProvider = ({children}) => {

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        getUserOnLoad()
    }, [])

    const getUserOnLoad = async () => {
        try{
            let accountDetails = await account.get();
            

            const profile = await database.getDocument(DEV_DB_ID, COLLECTION_ID_PROFILES, accountDetails.$id);
            console.log('profile:', profile)

            accountDetails['profile'] = profile  
            console.log(accountDetails)


            setUser(accountDetails)
        }catch(error){
            
        }
        setLoading(false)
    }

    const loginUser = async (userInfo) => {

        try{
            const response = await account.createEmailSession(
                userInfo.email, userInfo.password
                ) 
            
            const accountDetails =  await account.get()
            
            setUser(accountDetails)

        }catch(error){
            console.log('ERROR:', error)
        }
    }

    const logoutUser = async () => {
        console.log('Logout clicked')
        account.deleteSession('current')
        setUser(null)
        navigate('/login')
    }

    const contextData = {
        user,
        loginUser,
        logoutUser,
    }

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=> {return useContext(AuthContext)}

export default AuthContext;