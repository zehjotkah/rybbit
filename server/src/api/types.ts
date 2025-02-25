export type FilterType = "equals" | "not_equals" | "contains" | "not_contains";

export type FilterParameter =
  | "browser"
  | "operating_system"
  | "country"
  | "device_type"
  | "referrer"
  | "pathname";

export type Filter = {
  parameter: FilterParameter;
  value: string;
  type: FilterType;
};

export interface GenericRequest {
  Querystring: {
    startDate: string;
    endDate: string;
    timezone: string;
    site: string;
    filters: string;
  };
}
