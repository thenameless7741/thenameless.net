import s from './playground.module.scss';

interface Props {
  system?: string;
  user?: string;
  assistant?: string;
  labels?: {
    system?: string;
    user?: string;
    assistant?: string;
  };
  visible?: {
    system?: boolean;
  };
  interactive?: boolean;
}

const Playground = (p: Props) => {
  return (
    <div className={[s.playground, p.system ? s['has-system'] : ''].join(' ')}>
      {!!p.system && (
        <div className={s.user}>
          <div className={s.label}>{p.labels?.system ?? 'system'}</div>
          <div className={s.content}>{p.system}</div>
        </div>
      )}

      <div className={s.user}>
        <div className={s.label}>{p.labels?.user ?? 'user'}</div>
        <div className={s.content}>{p.user}</div>
      </div>

      <div className={s.assistant}>
        <div className={s.label}>{p.labels?.assistant ?? 'assistant'}</div>
        <div className={s.content}>{p.assistant}</div>
      </div>
    </div>
  );
};
export default Playground;
