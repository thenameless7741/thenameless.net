import s from './border.module.scss';

const Component = () => {
  return (
    <span aria-hidden={true} className={s.border}>
      <div className={s['gap-1']} />
      <div className={s['gap-2']} />
      <div className={s['gap-3']} />
      <div className={s['gap-4']} />
    </span>
  );
};
export default Component;
