import '../styles/globals.css'
import App from 'next/app'
import Head from "next/head";
import { useEffect, Fragment } from 'react'
import { Provider } from 'react-redux'
import { createWrapper } from 'next-redux-wrapper'
import store from '../store/store'
import '../scss/main.scss'
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import MainLayout from '../components/MainLayout'
import Router, { useRouter } from "next/router"
import { isUserLogin } from "../services/api"
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import 'antd/dist/antd.css'
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());
function MyApp({ Component, pageProps }) {
  const router = useRouter()
  console.log(`pathname`, router.pathname)

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, [])

  useEffect(() => {
    if (router.pathname !== '/login' && router.pathname !== '/register') {
      console.log('Check login')
      if (!isUserLogin()) {
        window.location.assign('/login')
      }
    }
  })
  return <>
    <Head>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      {/* Bootstrap CSS */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@200;400;500&display=swap" rel="stylesheet" />
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    </Head>

    {/* <div className="main-overlay">
      <div className="d-flex justify-content-center">
        <div className="spinner-grow text-primary" role="status" style={{ width: '3rem', height: '3rem', zIndex: '20' }}>
        </div>
      </div>
    </div> */}

    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {
          router.pathname !== '/login' && router.pathname !== '/register' ?
            <MainLayout>
              <Component {...pageProps} />
            </MainLayout> :
            <Component {...pageProps} />
        }
      </ThemeProvider>
    </Provider>
  </>
}

const makestore = () => store
const wrapper = createWrapper(makestore)

export default wrapper.withRedux(MyApp)
