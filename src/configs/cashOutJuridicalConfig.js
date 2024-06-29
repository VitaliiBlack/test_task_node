import axios from 'axios';

/**
 * @returns {Promise<CashOutJuridicalConfig>}
 */
const getCashOutJuridicalConfig = async () => {
  const response = await axios.get(
    'https://developers.paysera.com/tasks/api/cash-out-juridical',
  );
  return response.data;
};

export default getCashOutJuridicalConfig;
