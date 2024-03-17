import Border from '../border';
import s from './audience.module.scss';

interface Props {
  children: React.ReactNode;
}

const Audience = ({ children }: Props) => {
  return (
    <div className={s.audience}>
      <Border className={s.border} />
      <div className={s.label}>[ assumed audience ]</div>
      {children}
    </div>
  );
};
export default Audience;
