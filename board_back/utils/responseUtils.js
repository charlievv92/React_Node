/**
 * response 객체 생성 함수
 * @param {number} code - 응답 코드
 * @param {*} data - 응답 데이터
 * @param {string} message - 응답 메시지
 * @returns {{code: number, data: *, message: string}} 응답 객체
 */
const createResponse = (code, data, message) => {
  return {
    code,
    data,
    message,
  };
};

/**
 * 성공 응답 생성 함수
 * @param {*} data - 응답 데이터
 * @param {string} [message="Success"] - 응답 메시지
 * @returns {{code: number, data: *, message: string}} 성공 응답 객체
 */
const successResponse = (data, message = "Success") => {
  return createResponse(200, data, message);
};

/**
 * 클라이언트 오류 응답 생성 함수
 * @param {string} [message="Invalid input"] - 응답 메시지
 * @param {*} [data={}] - 응답 데이터
 * @returns {{code: number, data: *, message: string}} 클라이언트 오류 응답 객체
 */
const clientErrorResponse = (message = "Invalid input", data = {}) => {
  return createResponse(400, data, message);
};

/**
 * 클라이언트 오류 응답 생성 함수
 * @param {string} [message="Invalid input"] - 응답 메시지
 * @param {*} [data={}] - 응답 데이터
 * @returns {{code: number, data: *, message: string}} 클라이언트 오류 응답 객체
 */
const dataNotFoundErrorResponse = (message = "Data not found", data = {}) => {
  return createResponse(404, data, message);
};

/**
 * 서버 오류 응답 생성 함수
 * @param {string} [message="Server error"] - 응답 메시지
 * @param {*} [data={}] - 응답 데이터
 * @returns {{code: number, data: *, message: string}} 서버 오류 응답 객체
 */
const serverErrorResponse = (message = "Server error", data = {}) => {
  return createResponse(500, data, message);
};

module.exports = {
  createResponse,
  successResponse,
  clientErrorResponse,
  dataNotFoundErrorResponse,
  serverErrorResponse,
};
