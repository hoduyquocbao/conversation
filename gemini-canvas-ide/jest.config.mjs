/**
 * @fileoverview Cấu hình cho framework kiểm thử Jest, sử dụng cú pháp ES Modules.
 */

import nextJest from 'next/jest.js';

// Cung cấp đường dẫn đến ứng dụng Next.js của bạn để tải các file next.config.js và .env trong môi trường kiểm thử
const createJestConfig = nextJest({
  dir: './',
});

// Thêm bất kỳ cấu hình Jest tùy chỉnh nào vào đây
/** @type {import('jest').Config} */
const config = {
  // Báo cáo thông tin bao phủ mã nguồn (code coverage) sau khi chạy test
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',

  // Môi trường kiểm thử. 'jsdom' mô phỏng môi trường trình duyệt.
  testEnvironment: 'jest-environment-jsdom',

  // Cấu hình để Jest có thể hiểu được các đường dẫn import tùy chỉnh (ví dụ: @/components/...)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // `next/jest` sẽ tự động xử lý việc biên dịch TypeScript, do đó không cần `preset: 'ts-jest'`
};

// createJestConfig được xuất theo cách này để đảm bảo next/jest có thể tải cấu hình Next.js một cách không đồng bộ
export default createJestConfig(config);
