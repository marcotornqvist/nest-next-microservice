import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TodoProvider from '../context/todoContext';
import Navbar from '../components/layout/Navbar';
import '../styles/app.scss';
import axios, { AxiosRequestConfig } from 'axios';
import { useState } from 'react';

// create a function that called refreshToken that returns a new accessToken
// save that new accessToken in globalState
// create some functionality that will run the accessToken when currentDate is more than expiration
const idToken =
  'eyJraWQiOiJvNm5JMXh6amZYT0gwaUxWcjVhNlN6NDB6eDNHSVlwUUxSeEtKeTVqallZPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJlZDY5YTlkOS1lOGNjLTRmNzQtYTAyMS1kYTFkOWZmNmQ5MTgiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTFfeU1ack9HSHNLIiwiY29nbml0bzp1c2VybmFtZSI6Ijg3ZWYwMDgwLTViMTAtNDQ4Mi1iNTM5LWJjYjljZDBkNTQ2OCIsIm9yaWdpbl9qdGkiOiJhYzZjNWMwOS1hYjk4LTRjOTMtYjYxZi1jMTNhZTM2MWRlZGIiLCJhdWQiOiIzNzFkdXZ2aGE5MGkxZzU0aGJ0aGlwOWFpbiIsImV2ZW50X2lkIjoiYTlkNTcwZTEtYTkyZi00YzI0LWI3ODQtZjk1Yzc5MzYxODE3IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2NjE4NzY0MjgsImV4cCI6MTY2MTg4MDAyOCwiaWF0IjoxNjYxODc2NDI4LCJqdGkiOiJkYjZmZTk2ZC0wYTU0LTQ5NzYtODdjNC00ZGJkMDQ5MmM4Y2QiLCJlbWFpbCI6InNhbUBnbWFpbC5jb20ifQ.wTYEFI6UD8L-y6JhDrHFJdt88L4zBZL05NHtALGcZ_hNeQl4Ux9hx2QDIFNcE06f52PDFS1gI4ubIzBPkNLqDo2CILCHfOKkuMNBSRvY7mRovnGZAmPrxMti-SF-YT1bZ6FWtMU4RLOTsAOyP91xSpK5fysG8Pxlziag68Rcno3pWc-E0dDdsM72bApsgMk8AZS-4KDX1xZfe5r0cvaZR6nz8I4pJ41UtI9t6JvuhLFBtlf1j2gg7gSix3W3cqRy-aGkNgJSLoZyCSVvE42f8igMiHg_97TaJT17caX76_C4z3AxvWKOZbjIUH86dHg4P24RD0hK7epab3sdQy1Lxg';

function App({ Component, pageProps }: AppProps) {
  axios.defaults.headers.common['idToken'] = idToken;
  const queryClient = new QueryClient();

  const guestPost = async () => {
    const result = await axios.post(`${process.env.AUTH_URL}/guestPost`);

    console.log(result);
  };

  const authPost = async () => {
    const result = await axios.post(
      `${process.env.AUTH_URL}/authPost`,
      undefined,
      {
        withCredentials: true,
      },
    );

    console.log(result);
  };

  const refreshTokens = async () => {
    const result = await axios.post(`${process.env.AUTH_URL}/refresh`, null, {
      withCredentials: true,
    });

    console.log(result);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <button onClick={guestPost} style={{ marginRight: 24 }}>
        Guest Post
      </button>
      <button onClick={authPost} style={{ marginRight: 24 }}>
        Auth Post
      </button>
      <button onClick={refreshTokens}>Refresh Token</button>
      <TodoProvider>
        <Navbar />
        <Component {...pageProps} />
      </TodoProvider>
    </QueryClientProvider>
  );
}

export default App;
