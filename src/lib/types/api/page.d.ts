export type TPaginationResponseDto<T> = {
  page_number?: number;
  page_size?: number;
  total_records?: number;
  total_pages?: number;
  records?: T[];
};
