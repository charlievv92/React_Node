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
 * @returns {Promise} 삽입 결과 객체.
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
 * SELECT * FROM table WHERE conditions ORDER BY orderBy
 * @param {string} table 테이블명
 * @param {Array.<string>|string} columns 조회할 컬럼명
 * @param {object} conditions 조회 조건 객체
 * @param {object|""} orderBy 정렬 조건
 * @returns {Promise} 조회 결과 객체.
 */
const read = (table, columns = "*", conditions = {}, orderBy = "") => {
  const columnsClause = Array.isArray(columns) ? columns.join(", ") : columns;

  const whereClauses = [];
  const values = [];

  // conditions 객체를 순회하며 WHERE 절을 생성
  Object.keys(conditions).forEach((key) => {
    if (Array.isArray(conditions[key])) {
      const placeholders = conditions[key].map(() => "?").join(", ");
      whereClauses.push(`${key} IN (${placeholders})`);
      values.push(...conditions[key]);
    } else if (
      typeof conditions[key] === "string" &&
      conditions[key].includes("%")
    ) {
      whereClauses.push(`${key} LIKE ?`);
      values.push(conditions[key].trim());
    } else {
      whereClauses.push(`${key} = ?`);
      values.push(conditions[key]);
    }
  });

  const whereClause = whereClauses.length
    ? ` WHERE ${whereClauses.join(" AND ")}`
    : "";
  const sql = `SELECT ${columnsClause} FROM ${table}${whereClause}${
    orderBy ? ` ORDER BY ${orderBy}` : ""
  }`;
  return queryAsync(sql, values);
};

/**
 * DB UPDATE 쿼리문
 * @param {string} table 테이블명
 * @param {object} data 업데이트할 데이터 객체
 * @param {object} conditions 업데이트할 조건 객체
 * @returns {Promise} 업데이트 결과 객체.
 */
const update = (table, data, conditions) => {
  const setClause = Object.keys(data)
    .map((key) => `${key} = ?`)
    .join(", ");

  const whereClauses = [];
  const values = [...Object.values(data)];

  // 조건이 배열인 경우 IN 연산자 사용하도록 수정
  Object.keys(conditions).forEach((key) => {
    if (Array.isArray(conditions[key])) {
      const placeholders = conditions[key].map(() => "?").join(", ");
      whereClauses.push(`${key} IN (${placeholders})`);
      values.push(...conditions[key]);
    } else {
      whereClauses.push(`${key} = ?`);
      values.push(conditions[key]);
    }
  });

  const whereClause = whereClauses.join(" AND ");
  const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
  return queryAsync(sql, values);
};

/**
 * DELETE 쿼리문
 * @param {string} table
 * @param {object} conditions
 * @returns {Promise} 삭제 결과 객체.
 */
const remove = (table, conditions) => {
  const whereClauses = [];
  const values = [];

  // 조건이 배열인 경우 IN 연산자 사용하도록 수정
  Object.keys(conditions).forEach((key) => {
    if (Array.isArray(conditions[key])) {
      const placeholders = conditions[key].map(() => "?").join(", ");
      whereClauses.push(`${key} IN (${placeholders})`);
      values.push(...conditions[key]);
    } else {
      whereClauses.push(`${key} = ?`);
      values.push(conditions[key]);
    }
  });

  const whereClause = whereClauses.join(" AND ");
  const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
  return queryAsync(sql, values);
};

module.exports = { queryAsync, create, read, update, remove };
