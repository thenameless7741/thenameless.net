import dynamic from 'next/dynamic';

import Filter from './filter';
import s from './index.module.scss';

const Main = () => {
  return (
    <main className={s.main}>
      <Filter />
      <LazyModelTables />
    </main>
  );
};
export default Main;

const LazyModelTables = dynamic(() => import('./model-tables'), { ssr: false });
