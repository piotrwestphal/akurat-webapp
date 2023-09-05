import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import {useMemo} from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {registerInterceptors} from './core/http.client.ts'
import {
    confirmResetRoute,
    confirmSignupRoute, homeRoute,
    loginRoute,
    profileRoute,
    resetRoute,
    signUpRoute,
    welcomeRoute,
} from './core/routes.ts'
import {useAuth} from './ctx/AuthProvider.tsx'
import {ConfirmReset} from './views/auth/ConfirmReset.tsx'
import {ConfirmSignUp} from './views/auth/ConfirmSignUp.tsx'
import {Login} from './views/auth/Login.tsx'
import {Reset} from './views/auth/Reset.tsx'
import {SignUp} from './views/auth/SignUp.tsx'
import {Home} from './views/Home.tsx'
import {CreateProfile} from './views/profile/CreateProfile.tsx'
import {ProtectedRoutes} from './views/ProtectedRoutes.tsx'
import {PublicRoutes} from './views/PublicRoutes.tsx'
import {Welcome} from './views/Welcome.tsx'

// TODO: generate PWA assets https://www.npmjs.com/package/pwa-asset-generator
export const App = () => {
    const auth = useAuth()

    useMemo(() => {
        registerInterceptors(auth)
    }, [auth.token])

    return (
        <Routes>
            <Route element={<PublicRoutes/>}>
                <Route path={welcomeRoute} element={<Welcome/>}/>
                <Route path={loginRoute} element={<Login/>}/>
                <Route path={signUpRoute} element={<SignUp/>}/>
                <Route path={confirmSignupRoute} element={<ConfirmSignUp/>}/>
                <Route path={resetRoute} element={<Reset/>}/>
                <Route path={confirmResetRoute} element={<ConfirmReset/>}/>
                <Route path="*" element={<Navigate to={welcomeRoute} replace={true}/>}/>
            </Route>
            <Route element={<ProtectedRoutes/>}>
                <Route path={profileRoute} element={<CreateProfile/>}/>
                <Route path={homeRoute} element={<Home/>}/>
                <Route path="*" element={<Navigate to={homeRoute} replace={true}/>}/>
            </Route>
        </Routes>
    )
}

export default App
