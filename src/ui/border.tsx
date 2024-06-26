import s from './border.module.scss';

interface Props {
  className?: string;
}

const Component = ({ className }: Props) => {
  return (
    <span aria-hidden={true} className={[s.border, className ?? ''].join(' ')}>
      <div className={s['gap-1']} />
      <div className={s['gap-2']} />
      <div className={s['gap-3']} />
      <div className={s['gap-4']} />
    </span>
  );
};
export default Component;
