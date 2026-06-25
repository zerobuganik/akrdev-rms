-- CreateTable
CREATE TABLE "settlements" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "cash_paid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "card_paid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "upi_paid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "change_amt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settlements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "settlements_order_id_key" ON "settlements"("order_id");

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
