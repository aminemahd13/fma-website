"use client"

import { getUserData } from '@/api/UsersApi';
import { checkToken, getToken } from '@/lib/utils';
import { langState } from '@/store/langState';
import { userState } from '@/store/userState';
import React, { useEffect } from 'react'
import { useSetRecoilState } from 'recoil';

export const DataLoader = ({ lang }: { lang: string }) => {
  const setUserData = useSetRecoilState<any>(userState)
  const setLang = useSetRecoilState<any>(langState)

  useEffect(() => {
    const token = getToken();
    if (token) {
      if (!checkToken(token)) {
        localStorage.removeItem('access_token');
        setUserData(undefined);
      } else {
        getUserData()
          .then((res: any) => {
            if (res?.statusCode === 200) {
              setUserData(res.user);
            }
          })
      }
    }
    setLang(lang)
  }, [])

  return <></>;
}