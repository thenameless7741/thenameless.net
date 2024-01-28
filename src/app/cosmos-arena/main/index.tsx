import dynamic from 'next/dynamic';

import Filters from './filters';
import s from './index.module.scss';

const Main = () => {
  return (
    <main className={s.main}>
      <Filters />
      <LazyModelTables />
    </main>
  );
};
export default Main;

const LazyModelTables = dynamic(() => import('./model-tables'), { ssr: false });
