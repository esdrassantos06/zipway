-- CreateTable
CREATE TABLE "public"."logs" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "num" BIGINT,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);
