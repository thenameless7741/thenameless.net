'use client';

import Header from './header';
import Main from './main';
import { hfStore, lmsysStore } from './store';
import { HF, LMSYS } from './types';
import s from './app.module.scss';

interface Props {
  updatedAt: string;
  hfModels: HF.Model[];
  lmsysModels: LMSYS.Model[];
}

const App = ({ updatedAt, hfModels, lmsysModels }: Props) => {
  hfStore.setState({
    updatedAt,
    models: hfModels,
    filteredModels: hfModels,
  });
  lmsysStore.setState({
    updatedAt,
    models: lmsysModels,
  });

  return (
    <div className={s.app}>
      <Header />
      <Main />
    </div>
  );
};
export default App;
