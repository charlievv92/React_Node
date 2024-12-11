const db = require("../config/db");

/**
 * 비동기로 쿼리를 실행하고 결과를 반환하는 함수
 * @param {*} sql
 * @param {*} params
 * @returns
 */
const queryAsync = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

/**
 *
 * @param {*} table
 * @param {*} data
 * @returns
 */
const create = (table, data) => {
  const columns = Object.keys(data).join(", ");
  const placeholders = Object.keys(data)
    .map(() => "?")
    .join(", ");
  const values = Object.values(data);
  const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
  return queryAsync(sql, values);
};

/**
 *
 * @param {*} table
 * @param {*} columns
 * @param {*} conditions
 * @param {*} orderBy
 * @returns
 */
const read = (table, columns = "*", conditions = {}, orderBy = "") => {
  const columnsClause = Array.isArray(columns) ? columns.join(", ") : columns;

  const whereClause = Object.keys(conditions)
    .map((key) => `${key} = ?`)
    .join(" AND ");
  const values = Object.values(conditions);
  const sql = `SELECT ${columnsClause} FROM ${table}${
    whereClause ? ` WHERE ${whereClause}` : ""
  }${orderBy ? ` ORDER BY ${orderBy}` : ""}`;
  return queryAsync(sql, values);
};

/**
 *
 * @param {*} table
 * @param {*} data
 * @param {*} conditions
 * @returns
 */
const update = (table, data, conditions) => {
  const setClause = Object.keys(data)
    .map((key) => `${key} = ?`)
    .join(", ");
  const whereClause = Object.keys(conditions)
    .map((key) => `${key} = ?`)
    .join(" AND ");
  const values = [...Object.values(data), ...Object.values(conditions)];
  const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
  return queryAsync(sql, values);
};

/**
 *
 * @param {*} table
 * @param {*} conditions
 * @returns
 */
const remove = (table, conditions) => {
  const whereClause = Object.keys(conditions)
    .map((key) => `${key} = ?`)
    .join(" AND ");
  const values = Object.values(conditions);
  const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
  return queryAsync(sql, values);
};

module.exports = { queryAsync, create, read, update, remove };
