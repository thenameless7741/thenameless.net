import store from '../store';
import HFFilter from './hf-filter';
import LMSYSFilter from './lmsys-filter';

const Filters = () => {
  const arena = store((s) => s.arena);
  return arena === 'hf' ? <HFFilter /> : <LMSYSFilter />;
};
export default Filters;
