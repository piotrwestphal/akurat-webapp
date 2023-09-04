import {createTheme, CssBaseline, ThemeProvider} from '@mui/material'
import {LinkProps} from '@mui/material/Link'
import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter, Link as RouterLink, LinkProps as RouterLinkProps} from 'react-router-dom'
import App from './App.tsx'
import {AuthProvider} from './ctx/AuthProvider.tsx'
import './index.css'

const LinkBehavior = React.forwardRef<
    HTMLAnchorElement,
    Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
    const {href, ...other} = props
    // Map href (Material UI) -> to (react-router)
    return <RouterLink ref={ref} to={href} {...other} />
})

const theme = createTheme({
    components: {
        MuiLink: {
            styleOverrides: {
                root: 'text-decoration: none',
            },
            defaultProps: {
                component: LinkBehavior,
            } as LinkProps,
        },
    },
    palette: {
        primary: {
            main: '#607D8B',
            dark: '#455A64',
            light: '#CFD8DC',
        },
        secondary: {
            main: '#009688',
        },
        text: {
            primary: '#212121',
            secondary: '#757575',
        },
        divider: '#BDBDBD',
    },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <AuthProvider>
                    <CssBaseline/>
                    <App/>
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>,
)