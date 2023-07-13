import { ReactNode, useState, createContext, useEffect, } from 'react';

interface ProviderProps {
    children?: ReactNode
}

interface ContextProps {
    isAuthenticated: boolean,
    setIsAuthenticated: (value: boolean) => void,
    logout: () => void
}

export const UserContext = createContext<ContextProps>({
    isAuthenticated: false,
    setIsAuthenticated: (value: boolean) => {},
    logout: () => {}
});

export const UserProvider = ({children}: ProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // console.log("Je m'execute à chaque fois que le composant est monté");
        // async function fetchUserData() {
            // 1. Appeler la route /auth/me depuis le back, pour vérifier si je suis connecté.
            // const result = await fetch("http://localhost:5000/api/auth/me", {
                // method: "POST",
                // body: JSON.stringify({
                //     email: "",
                //     password: ""
                // }),
                // headers: { 'Content-Type': 'application/json' },
            })

            // const reponse = await result.json();
            // console.log(reponse);
            
                
                //  console.log(result.status);
            
            // 2. Si je suis connecté, je mets isAuthenticated à true (en faisant un setState)
            // 3. Si je ne suis pas connecté, je mets isAuthenticated à false (en faisant un setState)
        // }
        // // fetchUserData();
    // }, []);

    async function logout() {
        // Appeler la route /auth/logout depuis le back, pour me déconnecter
        // (supprimer le cookie httpOnly qui ne peut se supprimer autrement qu'en appelant le back)
        // Le cookie httpOnly est un cookie qui contient le token de connexion, et qui sert à s'authentifier sur les routes protégées
        setIsAuthenticated(false);
    }

    return (
        
        <UserContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout}}>
            {children}
        </UserContext.Provider>
    )
}
