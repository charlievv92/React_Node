const db = require("../config/db");

/**
 * 비동기로 쿼리를 실행하고 결과를 반환하는 함수. 복잡한 쿼리문을 실행하거나 여러 쿼리문을 실행할 때 사용
 * @param {string} sql 실행할 쿼리문
 * @param {*} params 쿼리문에 바인딩할 파라미터
 * @returns {Promise} 결과를 반환하는 프로미스 객체
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
 * DB INSERT 쿼리문
 * @param {string} table 테이블명
 * @param {object} data 입력할 데이터 객체
 * @returns {Promise<{code: number, data: object, message: string}} 삽입 결과 객체. 프론트에서 const {code, data, message} = response.data; 형태로 사용하면 됨
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
 * DB SELECT 쿼리문
 * @param {string} table 테이블명
 * @param {Array.<string>|string} columns 조회할 컬럼명
 * @param {object} conditions 조회 조건 객체
 * @param {object|""} orderBy 정렬 조건
 * @returns {Promise<{code: number, data: object, message: string}} 조회 결과 객체. 프론트에서 const {code, data, message} = response.data; 형태로 사용하면 됨
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
 * DB UPDATE 쿼리문
 * @param {string} table 테이블명
 * @param {object} data 업데이트할 데이터 객체
 * @param {object} conditions 업데이트할 조건 객체
 * @returns {Promise<{code: number, data: object, message: string}} 업데이트 결과 객체. 프론트에서 const {code, data, message} = response.data; 형태로 사용하면 됨
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
 * DELETE 쿼리문
 * @param {string} table
 * @param {object} conditions
 * @returns {Promise<{code: number, data: object, message: string}} 삭제 결과 객체. 프론트에서 const {code, data, message} = response.data; 형태로 사용하면 됨
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
