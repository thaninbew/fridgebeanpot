import { Head, useSyncData } from '@reactpwa/core';
import { FC } from 'react';
import { HomeData } from '../services/data';

const Hello: FC = () => {
  const { data, syncScript } = useSyncData('home.data', HomeData);
  return (
    <>
      <Head>
        <title>Hello, World!</title>
      </Head>
      <h2>{data.content}</h2>
      {syncScript}
    </>
  );
};

export default Hello;
