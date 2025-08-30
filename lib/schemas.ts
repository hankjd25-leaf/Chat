// JSON-UI를 위한 다양한 스키마 정의

// 카드형 답변 스키마
export const cardSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    subtitle: { type: "string" },
    cards: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          value: { type: "string" },
          href: { type: "string" },
          color: { type: "string" }
        },
        required: ["label", "value"]
      }
    }
  },
  required: ["title", "cards"]
};

// 통계 대시보드 스키마
export const dashboardSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    metrics: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          value: { type: "string" },
          change: { type: "string" },
          trend: { type: "string" }
        },
        required: ["name", "value"]
      }
    },
    chart: {
      type: "object",
      additionalProperties: false,
      properties: {
        type: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              label: { type: "string" },
              value: { type: "number" }
            },
            required: ["label", "value"]
          }
        }
      },
      required: ["type", "data"]
    }
  },
  required: ["title", "metrics"]
};

// 할 일 목록 스키마
export const todoListSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    todos: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          text: { type: "string" },
          completed: { type: "boolean" },
          priority: { type: "string" },
          dueDate: { type: "string" }
        },
        required: ["id", "text", "completed"]
      }
    }
  },
  required: ["title", "todos"]
};

// 제품 카탈로그 스키마
export const productCatalogSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    products: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "string" },
          image: { type: "string" },
          category: { type: "string" },
          rating: { type: "number" }
        },
        required: ["id", "name", "price"]
      }
    }
  },
  required: ["title", "products"]
};

// 스키마 매핑
export const SCHEMA_MAP = {
  cards: cardSchema,
  dashboard: dashboardSchema,
  todoList: todoListSchema,
  productCatalog: productCatalogSchema
};

export type SchemaType = keyof typeof SCHEMA_MAP;
