import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import {Provider, createClient} from 'urql'
import theme from '../theme'

function MyApp({ Component, pageProps }) {
   const client = createClient({url: "http://localhost:4000/graphql", 
  fetchOptions: {credentials: 'include'}
  })
  return (
    <Provider value={client}>
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
    </Provider>
  )
}

export default MyApp
