'use client';

import Header from './header';
import Main from './main';
import { hfStore } from './store';
import { HF } from './types';
import s from './app.module.scss';

interface Props {
  updatedAt: string;
  hfModels: HF.Model[];
}

const App = ({ updatedAt, hfModels }: Props) => {
  hfStore.setState({
    updatedAt,
    models: hfModels,
    filteredModels: hfModels,
  });

  return (
    <div className={s.app}>
      <Header />
      <Main />
    </div>
  );
};
export default App;
