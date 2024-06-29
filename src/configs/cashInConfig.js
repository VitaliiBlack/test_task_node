import axios from 'axios';
import '../types/index.js';

/**
 * @returns {Promise<CashInConfig>}
 */
const getCashInConfig = async () => {
  const response = await axios.get(
    'https://developers.paysera.com/tasks/api/cash-in',
  );
  return response.data;
};

export default getCashInConfig;
