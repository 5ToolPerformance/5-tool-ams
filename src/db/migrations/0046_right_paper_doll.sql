ALTER TABLE "player_notes"
ALTER COLUMN "created_at"
SET DATA TYPE timestamp
USING created_at::timestamp;

ALTER TABLE "player_notes"
ALTER COLUMN "created_at"
SET DEFAULT now();
