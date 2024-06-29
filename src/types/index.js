/**
 * @typedef {Object} Max
 * @property {number} amount
 * @property {string} currency
 */

/**
 * @typedef {Object} CashInConfig
 * @property {number} percents
 * @property {Max} max
 */

/**
 * @typedef {Object} WeekLimit
 * @property {number} amount
 * @property {string} currency
 */

/**
 * @typedef {Object} CashOutNaturalConfig
 * @property {number} percents
 * @property {WeekLimit} week_limit
 */

/**
 * @typedef {Object} Min
 * @property {number} amount
 * @property {string} currency
 */

/**
 * @typedef {Object} CashOutJuridicalConfig
 * @property {number} percents
 * @property {Min} min
 */

/**
 * @typedef {Object} Transaction
 * @property {string} type
 * @property {number} amount
 * @property {string} date
 */

/**
 * @typedef {Object} UserTransactions
 * @property {string} user_id
 * @property {Transaction[]} transactions
 */

/**
 * @typedef {Object} Operation
 * @property {number} amount
 * @property {string} currency
 */

/**
 * @typedef {Object} InputTransaction
 * @property {string} date
 * @property {number} user_id
 * @property {string} user_type
 * @property {string} type
 * @property {Operation} operation
 */

export default {};
