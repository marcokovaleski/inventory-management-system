import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const AuthApi = createApi({
  reducerPath: "AuthApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
  endpoints: (builder) => ({
    registerUser: builder.mutation<any, any>({
      query: (obj) => ({
        url: "/v1/auth/register",
        method: "POST",
        body: obj,
      }),
    }),
    loginUser: builder.mutation<any, any>({
      query: (obj) => ({
        url: "/v1/auth/login",
        method: "POST",
        body: obj,
      }),
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation } = AuthApi;
