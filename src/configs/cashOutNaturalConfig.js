import axios from 'axios';
import '../types/index.js';

/**
 * @returns {Promise<CashOutNaturalConfig>}
 */
const getCashOutNaturalConfig = async () => {
  const response = await axios.get(
    'https://developers.paysera.com/tasks/api/cash-out-natural',
  );
  return response.data;
};

export default getCashOutNaturalConfig;
