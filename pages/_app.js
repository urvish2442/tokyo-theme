import Head from 'next/head';
import Router from 'next/router';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import ThemeProvider from 'src/theme/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from 'src/createEmotionCache';
import { appWithTranslation } from 'next-i18next';
import { SidebarProvider } from 'src/contexts/SidebarContext';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from 'src/store';
import Loader from 'src/components/Loader';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import useScrollTop from 'src/hooks/useScrollTop';
import { SnackbarProvider } from 'notistack';
import { AuthConsumer, AuthProvider } from 'src/contexts/JWTAuthContext';

const clientSideEmotionCache = createEmotionCache();

function TokyoApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);
  useScrollTop();

  Router.events.on('routeChangeStart', nProgress.start);
  Router.events.on('routeChangeError', nProgress.done);
  Router.events.on('routeChangeComplete', nProgress.done);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Tokyo Black NextJS Javascript Admin Dashboard</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <ReduxProvider store={store}>
        <SidebarProvider>
          <ThemeProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <AuthProvider>
                <SnackbarProvider
                  maxSnack={6}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                >
                  <CssBaseline />
                  <AuthConsumer>
                    {(auth) =>
                      !auth.isInitialized ? (
                        <Loader />
                      ) : (
                        getLayout(<Component {...pageProps} />)
                      )
                    }
                  </AuthConsumer>
                </SnackbarProvider>
              </AuthProvider>
            </LocalizationProvider>
          </ThemeProvider>
        </SidebarProvider>
      </ReduxProvider>
    </CacheProvider>
  );
}

export default appWithTranslation(TokyoApp);
