import { z } from "zod";
import { Filter, FilterParameter, FilterType } from "./types.js";

// Schemas for getTimeStatement()
const tableSchema = z.enum(["events", "sessions"]).optional();

const dateParamsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  timezone: z.string(),
  table: tableSchema,
});

const timeStatementParamsSchema = z
  .object({
    date: dateParamsSchema.optional(),
    pastMinutes: z.number().nonnegative().optional(),
  })
  .refine((data) => data.date !== undefined || data.pastMinutes !== undefined, {
    message: "Either date or pastMinutes must be provided",
  });

// Schema for getTimeStatementFill()
const fillDateParamsSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  timezone: z.string(),
});

const timeStatementFillParamsSchema = z
  .object({
    date: fillDateParamsSchema.optional(),
    pastMinutes: z.number().nonnegative().optional(),
  })
  .refine((data) => data.date !== undefined || data.pastMinutes !== undefined, {
    message: "Either date or pastMinutes must be provided",
  });

const timeBucketSchema = z.enum([
  "minute",
  "five_minutes",
  "ten_minutes",
  "fifteen_minutes",
  "hour",
  "day",
  "week",
  "month",
  "year",
]);

// Schema for getFilterStatement()
const filterTypeSchema = z.enum([
  "equals",
  "not_equals",
  "contains",
  "not_contains",
]);

const filterParamSchema = z.enum([
  "browser",
  "operating_system",
  "language",
  "country",
  "region",
  "city",
  "device_type",
  "referrer",
  "pathname",
  "page_title",
  "querystring",
  "event_name",
  "channel",
  "entry_page",
  "exit_page",
  "dimensions",
]);

const filterSchema = z.object({
  parameter: filterParamSchema,
  type: filterTypeSchema,
  value: z.array(z.string()),
});

// Validate and sanitize inputs
export function sanitizeTimeStatementParams(params: unknown) {
  return timeStatementParamsSchema.parse(params);
}

export function sanitizeTimeStatementFillParams(
  params: unknown,
  bucket: unknown
) {
  const validatedParams = timeStatementFillParamsSchema.parse(params);
  const validatedBucket = timeBucketSchema.parse(bucket);

  return {
    params: validatedParams,
    bucket: validatedBucket,
  };
}

export function sanitizeFilters(filtersStr: string) {
  // First validate it's proper JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(filtersStr);
  } catch (e) {
    throw new Error("Invalid JSON format");
  }

  // Then validate the parsed structure
  return z.array(filterSchema).parse(parsed);
}
