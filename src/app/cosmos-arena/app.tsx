'use client';

import Header from './header';
import Main from './main';
import store from './store';
import { Model } from './types';
import s from './app.module.scss';

interface Props {
  models: Model[];
  updatedAt: string;
}

const App = ({ models, updatedAt }: Props) => {
  store.setState({
    models,
    updatedAt,
    filteredModels: models,
  });

  return (
    <div className={s.app}>
      <Header />
      <Main />
    </div>
  );
};
export default App;
